import { Component, OnInit } from '@angular/core';
import {FAQ} from "./question-answer";

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
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
    this.FAQs.push({
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
    this.FAQs.push({
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
    this.FAQs.push({
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
    this.FAQs.push({
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
    this.FAQs.push({
      question: "Mikortól lehet elfoglalni a szállást?",
      answer: "Amikor el lehet már foglalni a szállást akkor el lehet foglalni a szállást."
    });
  }
}

