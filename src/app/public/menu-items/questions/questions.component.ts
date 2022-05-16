import { Component, OnInit } from '@angular/core';
import { FAQ } from './question-answer';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  FAQs: FAQ[] = [];

  constructor() { }

  ngOnInit(): void {
    this.FAQs.push({
      question: 'Mi is az a Sweet Farm?',
      answer: '"Na most már mindennel tele van a hócipőm!” Ha ezt érzed, akkor ez a Te helyed! Természetközeli kikapcsolódás az olykor idegesítő civilizációs tényezőktől távol, erdei környezetben. A Sweet Farm, a Green Park Villa legújabb piknikező, szabadidős szolgáltatása.'
    });
    this.FAQs.push({
      question: 'Milyen messze van a belváros?',
      answer: 'A város széle 1 km, a belváros 4 km.'
    });
    this.FAQs.push({
      question: 'Hogyan lehet megközelíteni?',
      answer: 'Kicsit rossz minőségű a betonút, az utolsó 1 kilóméteres szakaszon, de eső esetén is járható. A farmon belül, letaposott füvön lehet közlekedni autóval, 100 méteres szakaszon.'
    });
    this.FAQs.push({
      question: 'Van–e más is a farmon?',
      answer: 'Nincs! Az egész Farm területét csak Te használhatod!'
    });
    this.FAQs.push({
      question: 'Mekkora területen fekszik?',
      answer: '1 hektár parkosított erdős terület.'
    });
    this.FAQs.push({
      question: 'Be van-e kerítve?',
      answer: 'Igen, zárt kerítés veszi körül.'
    });
    this.FAQs.push({
      question: 'Vannak-e szomszédok?',
      answer: 'A környezetben zártkertek gyümölcsösök vannak, de elég távol ahhoz, hogy ez ne okozzon gondot a kikapcsolódásban.'
    });
    this.FAQs.push({
      question: 'Taxik és ételfutárok kijönnek-e?',
      answer: 'Igen, széles a választék.'
    });
    this.FAQs.push({
      question: 'Vannak-e közművek?',
      answer: 'Igen vannak, de mivel ez egy környezettudatos életmódra kialakított hely, így csinnyán kell bánni minden erőforrással. A Vizet esővízből gyűjtjük, így takarékosságra ösztönöz, a meleg víz és áram napelemek segítségével rendelkezésre áll , de szintén odafigyelést igényel.'
    });
    this.FAQs.push({
      question: 'Hány helyiségből áll a Sweet Farm?',
      answer: 'Két helyiség, egy fürdőszoba, és egy terasz.'
    });
    this.FAQs.push({
      question: 'Van-e parkoló?',
      answer: 'Igen, a bekerített Farmon.'
    });
    this.FAQs.push({
      question: 'Van-e Wifi?',
      answer: 'Igen, korlátozott mértékben!'
    });
    this.FAQs.push({
      question: 'Van-e TV?',
      answer: 'Nincs.'
    });
    this.FAQs.push({
      question: 'Van-e légkondicionálás?',
      answer: 'Nnics.'
    });
    this.FAQs.push({
      question: 'Van-e fűtés?',
      answer: 'Igen, szezonálisan, hangulatos fatüzelésű kályha.'
    });
    this.FAQs.push({
      question: 'Van-e konyha?',
      answer: 'Igen! Alapvető konyhai felszereléssekkel ellátva, hűtőszekrénnyel, gáztűzhellyel.'
    });
    this.FAQs.push({
      question: 'Van-e szabadtéri sütögetésre alkalmas hely és eszközök?',
      answer: 'Igen, grillrács, nyársak, bogrács, és egy hangulatos nyársaló hely.'
    });
    this.FAQs.push({
      question: 'Háziállatot lehet-e hozni?',
      answer: 'Háziállatokat sajnos nem tudunk fogadni.'
    });
    this.FAQs.push({
      question: 'Lehet-e bankkártyával és szép kártyával fizetni?',
      answer: 'Igen.'
    });
    this.FAQs.push({
      question: 'Milyen különleges atrakciók vannak még a farmon?',
      answer: 'Kukkolda, lenyűgözö kilátás a városra, esti borozgatásra, magasles szerű kivitelezéssel. Grand bazár. Élmény sziget kerti bútorokkal, az erdőben, Vintage , igazi " vad"romantikus stílusban. Tollaspálya. Loro bár. Saját szabadtéri bárban koktélozhat, fa dekorációs papagályok igazi mediterrán hangulattal.'
    });
    this.FAQs.push({
      question: 'Hová kell megérkezni?',
      answer: 'Eger Attila u 15 szám alá, a Green Park Villába, ahol a tulajdonos útbaigazítást ad.'
    });
  }
}

