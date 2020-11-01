import keyboardSymbols from './assets/data/data.js'

interface Symbols {
    RUS: string[];
    RUS_SHIFT: string[];
    EN: string[];
    EN_SHIFT: string[];
    CODE: string[];
}


class Keyboard{
    keyboard = document.createElement('div') as HTMLDivElement;
    textarea = document.createElement('textarea') as HTMLTextAreaElement;
    capsLock: boolean = true;
    language: boolean = localStorage.getItem('language') === 'false' ? false : true;;
    shift: boolean = false;
    sound: boolean = localStorage.getItem('sound') === 'false' ? false : true;
    active: boolean = false;
    voice: boolean = true;
    symbol: Symbols;
    recognition: any;
constructor(state: Symbols){
    this.symbol = state;
}
    render = () =>{
        this.textarea.classList.add('display')
        this.textarea.placeholder = this.active ? '' : 'Click here...'
        this.keyboard.classList.add('keyboard', 'keyboard--hidden');
        this.keyboard.append(this.createKeys())
        document.body.append(this.textarea, this.keyboard)

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition();
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.continuous = true;

        this.recognition.addEventListener('result', (event: any) => { 
            for (let i = event.resultIndex; i < event.results.length; ++i) {
            let speechToText = event.results[i][0].transcript;
                this.textarea.setRangeText(speechToText, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
            } 
        })

        this.textarea.addEventListener('click', ()=>{
            this.active = !this.active;
            this.keyboard.classList.remove('keyboard--hidden')
            this.textarea.placeholder = ''  
        })

        document.body.addEventListener('keydown', (event) => { 
            this.textarea.focus();
          if(this.active && this.symbol.CODE.includes(event.code)){ 
             const pressKey = document.querySelector(`.keyboard__key[data-code="${event.code}"]`) as HTMLButtonElement;
             this.playAudio(event.code);
            if(pressKey.className === 'keyboard__key standard'){
                event.preventDefault()
                this.textarea.setRangeText(pressKey.textContent, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
            }
            pressKey?.classList.add('active');
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                if (event.repeat) return;
                event.preventDefault();
                pressKey.classList.toggle('press');
                pressKey.classList.toggle('keyboard__key--active_shift');
                this.shift = !this.shift;
                this.changeLanguageAndShift();
            }
            if (event.code === 'CapsLock' ) {
                if (event.repeat) return;
                pressKey.classList.toggle('press');
                pressKey.classList.toggle('keyboard__key--capsLock_active');
                this.pressCaps();
            }
            if (event.code === 'Tab' ) {
                event.preventDefault();
                this.textarea.setRangeText('\t', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
            }
        }
        });

        document.body.addEventListener('keyup', (event) => {
          document.querySelector(`.keyboard__key[data-code="${event.code}"]`)?.classList.remove('active');
          if (event.code === 'ShiftLeft') {
            if (event.repeat) return;

          }
        });
    }

     createIconHTML = (icon_name: string) => {
        return `<i class="material-icons">${icon_name}</i>`;
      };

    createKeys =() => {
        const fragment = document.createDocumentFragment();
        
        this.symbol.CODE.forEach((key: string, i: number) => {
            const  keyElement = document.createElement('button') as HTMLButtonElement;
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            keyElement.setAttribute('data-code', key);
            const languageKey = this.language ? this.symbol.EN[i] : this.symbol.RUS[i]
            switch(key){
                case 'Backspace':
                    keyElement.classList.add("keyboard__key--backspace");
                    keyElement.textContent = languageKey
                    keyElement.addEventListener('click', () => {
                        if(this.textarea.value.length > 0){
                            this.textarea.setRangeText('', this.textarea.selectionStart - 1,this.textarea.selectionStart, 'select');
                        }
                        this.textarea.focus()
                        this.playAudio(key)
                    })
                    break
                    case 'Tab':
                        keyElement.classList.add("keyboard__key--tab");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', () => {
                            this.textarea.setRangeText('\t', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                        break
                    case 'Delete':
                        keyElement.classList.add("keyboard__key--del");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', () => {
                            this.textarea.setRangeText('', this.textarea.selectionStart,this.textarea.selectionStart + 1, 'select');
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                        break
                    case 'CapsLock':
                        keyElement.classList.add("keyboard__key--capsLock");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', (e:any) => {
                            this.pressCaps()
                            e.target.classList.toggle('press')
                            e.target.classList.toggle('keyboard__key--capsLock_active')
                            this.playAudio(key)
                        })
                        break
                    case 'Enter':
                        keyElement.classList.add("keyboard__key--enter");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', () => {
                            this.textarea.setRangeText('\n', this.textarea.selectionStart,this.textarea.selectionStart, 'end');
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                         break
                    case 'ShiftLeft':
                         keyElement.classList.add("keyboard__key--shiftLeft");
                         keyElement.textContent = languageKey
                         keyElement.addEventListener('click', (e:any) => {
                            this.shift = !this.shift
                            e.target.classList.toggle('keyboard__key--active_shift')
                            e.target.classList.toggle('press')
                            this.changeLanguageAndShift()
                            this.playAudio(key)
                        })
                         break
                    case 'ShiftRight':
                        keyElement.classList.add("keyboard__key--shiftRight");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', (e:any) => {
                            this.shift = !this.shift
                            e.target.classList.toggle('keyboard__key--active_shift')
                            e.target.classList.toggle('press')
                            this.changeLanguageAndShift()
                            this.playAudio(key)
                        })
                        break
                    case 'ControlLeft':
                        keyElement.classList.add("keyboard__key--controlLeft");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', (e:any) => {
                            this.keyboard.classList.add('keyboard--hidden')
                            this.textarea.placeholder = 'Click here...'
                            this.active = !this.active;
                            this.playAudio(key)
                        })
                        break
                    case 'ControlRight':
                        keyElement.classList.add("keyboard__key--controlRight");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', () => {
                            this.playAudio(key)
                        })
                        break
                    case 'AltLeft' :
                        keyElement.classList.add("keyboard__key--alt");
                        keyElement.innerHTML = this.createIconHTML("keyboard_voice")
                        keyElement.addEventListener('click', () => {
                            this.textarea.focus()
                            this.playAudio(key)
                            this.recognition.lang = this.language ? 'en-US' : 'ru-RU';
                            if(this.voice){
                                document.querySelector(`.keyboard__key[data-code="AltLeft"]`)?.classList.add('keyboard__key--active_voice')
                                this.recognition.start()
                            }else{
                                this.recognition.stop()
                                document.querySelector(`.keyboard__key[data-code="AltLeft"]`)?.classList.remove('keyboard__key--active_voice')
                            }
                            this.voice = !this.voice;
                        })
                        break
                        case  'AltRight':
                            keyElement.innerHTML =  this.createIconHTML(`${this.sound ? 'volume_up' : 'volume_off'}`)
                            keyElement.addEventListener('click', () => {
                                this.playAudio(key)
                                this.sound = !this.sound
                                keyElement.innerHTML = this.createIconHTML(`${this.sound ? 'volume_up' : 'volume_off'}`)
                                localStorage.setItem('sound', String(this.sound))
                            })
                        break;
                    case 'Space':
                        keyElement.classList.add("keyboard__key--space");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener('click', () => {
                            this.textarea.setRangeText(' ', this.textarea.selectionStart,this.textarea.selectionStart, 'end');
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                        break
                    case 'ArrowUp':
                        keyElement.classList.add("keyboard__key--arrow");
                        keyElement.innerHTML = languageKey;
                        keyElement.addEventListener('click', () => {
                            this.playAudio(key)
                        })
                        break
                    case 'ArrowDown':
                        keyElement.classList.add("keyboard__key--arrow");
                        keyElement.innerHTML = languageKey;
                        keyElement.addEventListener('click', () => {
                            this.playAudio(key)
                        })
                        break
                    case 'ArrowLeft':
                        keyElement.classList.add("keyboard__key--arrow");
                        keyElement.innerHTML = languageKey
                        keyElement.addEventListener('click', () => {
                            this.textarea.selectionEnd -= 1;
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                            break
                    case 'ArrowRight':
                        keyElement.classList.add("keyboard__key--arrow");
                        keyElement.innerHTML = languageKey
                        keyElement.addEventListener('click', () => {
                             this.textarea.selectionStart += 1;
                            this.textarea.focus()
                            this.playAudio(key)
                        })
                        break
                        case 'MetaLeft':
                            keyElement.textContent = this.language ? 'EN' : 'RU'
                            keyElement.addEventListener('click', (e: any ) => {
                                this.language = !this.language
                                e.target.textContent = this.language ? 'EN' : 'RU'
                                 this.changeLanguageAndShift()
                                 this.playAudio(key)
                                 localStorage.setItem('language', String(this.language))
                            })
                            break
                    default:
                        keyElement.classList.add("standard");
                        keyElement.textContent = languageKey
                        keyElement.addEventListener("click", (e: any) => {
                            this.textarea.setRangeText(e.target.textContent, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
                            this.textarea.focus()
                            this.playAudio(key)
                          });
                         
            }
            fragment.appendChild(keyElement); 
        });
        return fragment
    }

    pressCaps = () => {
        this.capsLock = !this.capsLock
        const caps = document.querySelectorAll('.standard') as NodeListOf<Element>
        caps.forEach((key: any) => {
           key.textContent = !this.capsLock && !this.shift ? key.textContent?.toUpperCase() 
           : !this.capsLock && this.shift ? key.textContent?.toLowerCase() 
           : this.capsLock && this.shift ? key.textContent?.toUpperCase() : key.textContent?.toLowerCase()
        })
    }

    changeLanguageAndShift = () => {
        const keys = document.querySelectorAll('.keyboard__key') as NodeListOf<Element>
        keys.forEach((key, i: number) => {
            if(key.className === 'keyboard__key standard' && this.language){
                key.textContent = this.shift && this.capsLock ? this.symbol.EN_SHIFT[i] 
                                : this.shift && !this.capsLock ?  this.symbol.EN_SHIFT[i].toLowerCase() 
                                : !this.shift && !this.capsLock ? this.symbol.EN[i].toUpperCase() : this.symbol.EN[i]
            }
            if(key.className === 'keyboard__key standard' && !this.language){
                key.textContent = this.shift && this.capsLock ? this.symbol.RUS_SHIFT[i]
                                : this.shift && !this.capsLock ?  this.symbol.RUS_SHIFT[i].toLowerCase() 
                                : !this.shift && !this.capsLock ? this.symbol.RUS[i].toUpperCase() : this.symbol.RUS[i]
                }
        })
    }

    playAudio = (value: string) => {
        if(this.sound){
            let src: string = `./assets/audio/${this.language ? 'en.mp3' : 'ru.wav'}`;
            switch(value){
                case 'Backspace':
                case 'Delete': 
                    src = './assets/audio/backspace.wav';
                    break;
                case 'Tab':
                case 'Space':
                    src = './assets/audio/spacebar.wav';
                    break;
                case 'Enter':
                    src = './assets/audio/enter-key.wav';
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':  
                    src = './assets/audio/ctrlkey.wav';
                    break;
                case 'CapsLock':
                    src = './assets/audio/capsLock.wav'
                    break;
                default:
                    src = `./assets/audio/${this.language ? 'en.mp3' : 'ru.wav'}`
            }
            const myAudio = new Audio();
            myAudio.src = src;
            myAudio.play();
        }
      }
        
}

const keyboard = new Keyboard(keyboardSymbols)


window.addEventListener("DOMContentLoaded", function () {
    keyboard.render()
  });
