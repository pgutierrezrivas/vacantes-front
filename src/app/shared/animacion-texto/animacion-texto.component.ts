import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-animacion-texto',
  imports: [],
  templateUrl: './animacion-texto.component.html',
  styleUrl: './animacion-texto.component.css'
})
export class AnimacionTextoComponent implements OnInit, OnDestroy{
  @Input() words: string[] = [
    'Bienvenido',
    '¿En qué podemos ayudarte?',
    'Explora nuestros servicios',
    'Publica nuevas vacantes',
    'Gestiona tus solicitudes',
    'Encuentra el mejor talento'
  ];
  @Input() animationTimeInMs: number = 70;
  @Input() delayInMs: number = 1500;
  
  currentText: string = '';
  private intervalId: any;
  private timeoutId: any;

  ngOnInit(): void {
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  startAnimation(): void {
    this.open(0);
  }

  private close(index: number): void {
    const currentWord = this.words[index % this.words.length];
    this.currentText = currentWord;
    
    this.intervalId = setInterval(() => {
      if (!this.currentText) {
        clearInterval(this.intervalId);
        this.timeoutId = setTimeout(() => {
          this.open(++index);
        }, 100);
        return;
      }
      this.currentText = this.currentText.slice(0, -1);
    }, this.animationTimeInMs);
  }

  private open(index: number): void {
    const initialText = this.words[index % this.words.length];
    let i = 1;
    this.currentText = '';
    
    this.intervalId = setInterval(() => {
      if (this.currentText.length === initialText.length) {
        clearInterval(this.intervalId);
        this.timeoutId = setTimeout(() => {
          this.close(index);
        }, this.delayInMs);
        return;
      }
      this.currentText = initialText.slice(0, i++);
    }, this.animationTimeInMs);
  }

}
