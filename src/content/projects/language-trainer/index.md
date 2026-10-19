---
title: 'Language Trainer: a language teacher in the browser that listens when you speak'
world: work
date: 2026-10-06
summary: "Piano and Guitar Trainer's sibling for languages. You say every word out loud: it shows how each one sounds, waits while you take your time, and coaches the words you miss one at a time. Spanish has a full 48-day course with a library of stories; starter courses in thirteen more languages, from French and German to Japanese and Hindi, are live, every language has a patient sound practice for the words you stumble on, and English has a speech practice site of its own."
featured: true
featuredRank: 1
cover: ./cover.jpg
coverAlt: "Language Trainer’s language picker: a card for each language with a greeting in its own script and how it sounds, ¡Hola! (OH-lah) with the 48-day course, then Bonjour, Hallo, Hoi, Ciao, Olá, Γεια σου and Hei"
tags: ['language-learning', 'spanish', 'french', 'german', 'japanese', 'korean', 'hindi', 'english', 'speech', 'pronunciation', 'javascript', 'education']
draft: false
---

## What it is

Language Trainer is the language version of [Piano Trainer](/work/piano-trainer) and [Guitar Trainer](/work/guitar-trainer): a teacher in the browser that hears your answers, keeps you on each exercise until it's right, and helps when it isn't. It needs no account and nothing installed. Pick a language at **[language.jlwhite.ca](https://language.jlwhite.ca)**; each one is a site of its own, such as [spanish.jlwhite.ca](https://spanish.jlwhite.ca), and can also be opened straight from a folder of files, offline (speech recognition is the one part that may need a connection, see below).

It started as Spanish Trainer, and Spanish is still the most complete: a 48-day course and a library of stories, described below. The same app now teaches other languages from the same code, each with a starter course first (see **More languages**).

The Spanish is Latin American, as it's spoken from Mexico to Argentina: *ustedes* for "you all" and never *vosotros*, *seseo* in the voices, *carro*, *celular* and *computadora*.

## Getting started

The first visit opens a short welcome. It asks how you'd like to answer, checks that it can hear you if you chose to speak, shows you round the screen, and takes you into day one of the course or into the library. You choose your teacher there too: Heart or Michael, each paired with a Spanish voice (Dora or Alex) that says the Spanish.

![The welcome: ¡Bienvenido!, the three steps of the tour, and a choice of teacher, Heart or Michael, with Dora reading the Spanish](./welcome.jpg)

There are three ways to answer, and you can switch at any time:

- **Speaking.** The browser's own speech recognition turns what you say into words, in Chrome, Edge, Safari and Chrome on Android. Answers are compared by sound, not spelling: the spellings a recogniser might pick for the same sounds (*hola* and *ola*, *vaca* and *baca*, and *casa* and *caza*, which sound alike in Latin America) all count, numbers it writes as digits are read as words, and the best of its guesses is used. It's patient: a learner reading a word out slowly pauses, and a recogniser calls the first pause the end, so a pause ends a piece of the answer, not the answer, and it keeps listening until all of it has been said. What it heard is shown with each word of the answer marked right, wrong or missing.
- **Typing.** Every word is checked; case and punctuation never matter. A missing accent (*esta* for *está*, *ano* for *año*) counts as right but is pointed out, unless strict accents are turned on. The accented letters are buttons under the box, or typed as `a'`, `n~` and `u"`.
- **Say it, and check myself.** No microphone: say it out loud, hear it said, and tell the teacher how it went.

## The Spanish course

The course is 48 days over eight weeks, each day under an hour, from saying hello and spelling your name to the preterite and the imperfect, commands, *por* and *para*, and a graduation conversation. About 1,100 new words are taught along the way, a couple of dozen a day.

![The course home: level and XP, today’s goal, a button to start day one, and the first two weeks of days, from ¡Hola! and ¿Cómo estás? to Hay and Mi familia y mi casa](./course.jpg)

Every day has the same shape: a warm-up, a review of exercises that are due again, the day's new words, something new (explained by the teacher with examples, then practised), a conversation, a reading you've never seen with questions on it, a game, and *your turn*: the conversation again, without stopping. The last day of each week is a conversation day that ends with a conversation about you, in your own words.

The exercises are the ones a language teacher uses: what does it mean, build the sentence from tiles, say it in Spanish, read it aloud, repeat after me, write what you hear, fill the gap. The games are matching pairs, numbers, a one-minute verb sprint, echo, and *el or la?*.

![Building a sentence: "The soup is cold." with the words la, sopa, está, fría and two that don’t belong as tiles to tap in order, and the teacher’s panel beside it](./lesson.jpg)

Starting out, nothing is said blind. For the first two weeks, every word you're asked to say is on the screen, spelled out the way it sounds, with a tip for its trickiest sound, and each conversation begins by practising its words one at a time. A word you miss is coached on its own: shown big with its syllables, said slowly, then just that word from you, a few goes, before the whole sentence again.

![Day one's warm-up on a phone: hola, spelled out as oh-lah, the tip "The silent h. The h is never said", and the microphone listening](./start.jpg)

As in the siblings, it keeps you on an exercise until it's 100% right, and the help escalates a step at a time: "nearly!", then slower voices, hints with the first letter of each word, just the sentences you missed until they're right, word tiles instead of writing, and after a while a break and the offer to skip it for now so it comes back in a review. A missed sentence is shown, said and asked again at the end of the run, but the score is what was right the first time. Nothing moves on by itself: after each answer the card stays, with **Say it again** (for practice, it doesn't change the score) and **Hear it again**, until you tap Next, and a word being learned always has its English beside it.

Reviews bring exercises back before you forget them, at 1, 2, 4, 8 and 16 days, and sooner for one that needed help. **Learn this** does the same for anything in the library, a few lines at a time. Around it all there are XP, levels, badges, a daily goal and a streak, and **My words** lists every word you've met, how well you know it, and a quick quiz on the ones that are due.

## How it sounds

Spanish is said the way it's written, so the app works out every word's pronunciation from its spelling: its syllables with the strong one marked, a spelling an English speaker can read out, and its pronunciation in IPA. Tap any word, in the reader or in a lesson, and it says what the word is and what it means ("tengo: tener, to have; present, yo"), says it, slowly too, and gives a tip for each of its tricky sounds.

![A tapped word, Buenos: bue·nos, bweh-nohs, /ˈbwe.nos/, the tip "Two vowels, one beat", a link to all the sounds of Spanish, and the phrases it appears in](./word.jpg)

The tips cover the sounds English speakers find hard: the rolled r, the breathy j, ll said like y, the soft d, two vowels in one beat. In a lesson, a word that wasn't heard right is shown spelled out the same way, and the teacher says the tip for its trickiest sound. **The sounds of Spanish**, in Help, has every tip with words to hear.

## Sound practice

**🗣 Sounds** is for the words that won't come out right. It lists the sounds of the language that English speakers find hard, each with words from the course that have it, and **Your tricky words**, the ones a lesson had to coach. A word at a time, it shows the word, its meaning and how it sounds, says it (slowly too), gives the tip for its tricky sound, and waits for you as long as you need: long pauses don't end your turn, and ✓ I'm done says when you've finished.

It's built for stumbling. When it hears a word started twice, a piece repeated, or a second miss, it says something encouraging and builds the word up from its end, the way speech therapists do: *VWAHR*, then *ruh-VWAHR*, then *au revoir*, each piece said for you to echo, then the whole word again. Nothing is marked wrong, and a word that still won't come is put aside kindly for next time. Each piece is recorded ahead of time from the word's pronunciation, so it's the same voice saying it. It's practice, not therapy, and it says so: a speech-language pathologist can help in ways an app can't.

**English speech practice**, at [english.jlwhite.ca](https://english.jlwhite.ca), is the same practice on its own, for the sounds people find hard in English: the two *th*s, *r* and *l*, *v* and *w*, *s* and *sh*, the short vowels, *str*-type clusters and *-ed* endings, each with the most common words that have it.

## The reader and the library

The reader plays a conversation, a story or a poem a line at a time, each word lighting up as it's said, with the English underneath, a tap away, or off. It asks which of the people you'd like to be, then you say your lines when it waits for you, repeat every line after the voice, or keep going like a real conversation and be scored. It slows down without changing the voice, loops a few lines, and the strip along the bottom jumps to any line.

The library holds 6 first stories, 12 everyday conversations, 10 short stories, 6 fables retold, 20 sayings, 6 poems by Martí, Bécquer, Machado and Darío, and the openings of *Don Quijote*, *Platero y yo* and *Tres héroes*, plus the 96 conversations and readings of the course. Each one says from which day of the course you know its words, and a word only a classic uses has its meaning there.

## Every sentence checked against what's been taught

The course is written in a small notation, a week to a file, and built from it. The build knows every form of every word: the plural of a noun, the forms of an adjective, and every tense of a verb, irregular ones included (*tener*: tengo, tuve, tenía, tendré, tenga, ten), with stem changes (*quiero*, *puedo*, *pido*), spelling changes (*busqué*, *conozco*) and pronouns on the end (*levantándome*, *dímelo*). It also knows the day each word is taught and the day each tense is, and it stops on any sentence that uses a word or a tense before its day. So a lesson never asks you for something you haven't met, and the same dictionary is the one the app shows when you tap a word.

## The voices

Every line is pre-recorded locally, more than twelve thousand clips in four voices: the English teachers with the Kokoro text-to-speech model, and Dora and Alex, the Spanish voices, with a Piper voice made from recordings of native Spanish speakers. Kokoro's own Spanish voices didn't sound like Spanish (a speech recogniser heard his *hola* as another language, and hers as "go lad"), and on the same test the Piper voices are the clearest. The teachers speak English, and the Spanish inside what they say ("To say hello, say *hola*") is spoken by the Spanish voice that goes with them, joined into one clip. Every Spanish sentence is recorded in both Spanish voices, pronounced as Latin American Spanish, and Whisper finds when each word starts so the reader can light the words up as they're said.

## Phones and tablets

On a small screen the toolbar is one row, the rest moves into a ⋯ panel, and a lesson's teacher sits under the exercise, or beside it with the phone on its side. The screen stays on during a lesson, and added to the home screen it opens like an app.

![Spanish Trainer on a phone: a conversation in the reader, and a typed answer with "libro" marked as the word that was misspelled and the right sentence shown](./phone.jpg)

## More languages

Every language uses the same app and the same kind of course: the language's own sounds and most common words first, each word coached until it's right, then greetings, numbers, names, ordering at a café, finding your way, and conversations where you choose your part. A starter course is seven days; the full course follows, one language at a time. Thirteen are live: [French](https://french.jlwhite.ca), [German](https://german.jlwhite.ca), [Dutch](https://dutch.jlwhite.ca), [Italian](https://italian.jlwhite.ca), [Brazilian Portuguese](https://portuguese.jlwhite.ca), [Norwegian](https://norwegian.jlwhite.ca), [Danish](https://danish.jlwhite.ca), [Greek](https://greek.jlwhite.ca), [Ukrainian](https://ukrainian.jlwhite.ca), [Hindi](https://hindi.jlwhite.ca), [Filipino](https://filipino.jlwhite.ca), [Japanese](https://japanese.jlwhite.ca) and [Korean](https://korean.jlwhite.ca). Swedish is being recorded, and each goes live once its voices are recorded and checked. Each language is a course of its own: the teacher names the language you're learning, and the tips compare its sounds to English, never to another language. And every one follows the same pattern as Spanish's first week: a reading every day with questions, fill the gap and write what you hear, the same games (with a gender game in each language's own terms: *le or la?*, *der, die or das?*, *ο, η or το?*), a library of its conversations and readings, and levels and badges in the language.

Almost all of the work to add a language runs on my own machines, with free tools:

- **Every sentence is checked against what's been taught.** Each day's words are listed with every form a sentence may use, and the build refuses a sentence with a word that hasn't been taught yet.
- **How each word sounds** comes from a pronunciation engine (espeak-ng), turned into the same English-friendly spelling the Spanish course uses (*bonjour*: bohn-ZHOOR, *grazie*: GRAH-tsyeh, *привіт*: pree-VEET), with corrections per language where the engine is wrong.
- **The voices** are free voices recorded locally: two per language where there are two (Danish, Greek, Korean and Filipino have one), chosen by having a speech recogniser transcribe each candidate and keeping the clearest.
- **The English matches.** Every sentence is translated back into English by a local translation model, and the ones whose meaning drifts from the course's English are read again by hand.

Each language has its own speech-recognition locale, its own sound-alike rules (a recogniser writing *das* or *dass*, *ces* or *ses*), its own number words, and its own letters for typing. Greek, Ukrainian, Hindi and Korean are written in their own scripts, with the sounds-like spelling under every word while you learn to read them.

## Honest limits

Speech recognition is the browser's, not the app's. Chrome and Edge send what you say to Google's or Microsoft's speech service unless the browser can recognise it on the device, and Firefox has none at all, so there it's typing or checking yourself, and sound practice waits for you to say the word and tap when you're happy with it. On Android a page that holds the microphone leaves the recogniser hearing silence, so on phones the level meter follows the recogniser instead of opening the microphone itself. Sound practice is practice, not speech therapy. The tests drive every exercise through a stand-in recogniser, which proves the app's side but not how well a given browser hears a given accent.

The voices are synthetic, made from native speakers' recordings where a free voice like that exists. Every voice is now checked on single words as well as sentences before it's used: Greek's first voice read sentences well but babbled on single words, and was replaced. The newer languages' sounds-like spellings and voices come from free tools and are checked by machine and by eye, not yet by native speakers of each language.

## Closing

The piano and guitar versions rest on hearing the instrument honestly. Here the instrument is your voice, and the hard part moved: not hearing the sound, which the browser does, but deciding fairly whether what it heard is what you meant to say, and making sure every sentence the course asks for is one you've actually been taught.
