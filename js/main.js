const { createApp } = Vue;

createApp({
  data() {
    return {
      contacts,
      activeUser: 0,
      newMessage: "",
      searchText: "",
      activeMessage: "",
      userTyping: false,
      pcTyping: false,
      chatOptions: false,
      userOptions: false,
      newUserAvatar: "",
      newUsername: "",
    };
  },
  methods: {
    logga(qualcosa) {
      console.log(qualcosa);
    },
    // AGGIUNGI CONVERSAZIONE
    addChat(name, avatar) {
      const nuovaChat = {
        name,
        avatar,
        visible: true,
        messages: [],
      };
      this.contacts.push(nuovaChat);
    },
    // AGGIUNGI IL MESSAGGIO
    addMessage(messaggio, utente) {
      let messaggioValido = false;
      // controllo che il messaggio abbia più di 1 carattere
      messaggio.length > 1 ? (messaggioValido = true) : "";
      // il messaggio non deve contenere solo spazi
      for (let i = 0; i < messaggio.length; i++) {
        const letter = messaggio[i];
        letter != " " ? (messaggioValido = true) : (messaggioValido = false);
      }

      if (messaggioValido == true) {
        const timeStamp = luxon.DateTime.now()
          .setLocale("it")
          .toLocaleString(luxon.DateTime.DATETIME_SHORT_WITH_SECONDS);
        const parsedTimeStamp = luxon.DateTime.fromFormat(
          timeStamp,
          "dd/L/yyyy, hh:mm:ss"
        ).toFormat("dd/LL/yyyy HH:mm:ss");
        const nuovoMessaggio = {
          date: parsedTimeStamp,
          text: messaggio,
          status: "sent",
        };
        this.contacts[utente].messages.push(nuovoMessaggio);
        this.newMessage = "";
        // INVOCO RISPOSTA DOPO UN SECONDO
        setTimeout(() => this.reply(utente, parsedTimeStamp), 1000);
        // MOSTRO CHE IL PC STA SCRIVENDO
        this.pcTyping = "writing";
        setTimeout(() => {
          this.pcTyping = false;
          this.pcTyping = "online";
          setTimeout(() => (this.pcTyping = false), 2000);
        }, 1000);
        // SCROLL DOWN AUTOMATICO this.$nextTick si usa per attendere l'aggiornamento del DOM prima di effettuare un'altra azione
        this.$nextTick(() => {
          const chatArea = this.$refs.chatarea;
          chatArea.scrollTo(0, chatArea.scrollHeight);
        });
      }
    },

    // RISPOSTA AUTOMATICA ALL'UTENTE
    reply(user, time) {
      const risposte = [
        "Neppure i più saggi conoscono le conseguenze!",
        "They're taking the hobbits to Isengard!",
        "Dov'era Gondor?!",
        "Tu non puoi passare!",
        "Ritorna nell'ombra!",
        "Fuggite, sciocchi!",
        "VINOH!!!",
        "Case di paglia, che bevono paglia.",
        "Lupo ululà, castello ululì!",
        "E' finito il vino.",
        "Allora va'.. e riempilo!",
        "Sire, non c'è più vino",
      ];
      let numeroRisposta = Math.floor(Math.random() * risposte.length);

      const rispostaText = {
        date: time,
        text: risposte[numeroRisposta],
        status: "received",
      };
      this.contacts[user].messages.push(rispostaText);
      // SCROLL DOWN AUTOMATICO
      this.$nextTick(() => {
        const chatArea = this.$refs.chatarea;
        chatArea.scrollTo(0, chatArea.scrollHeight);
      });
    },
    // CERCA UTENTE
    cerca(nomeCercato) {
      if (nomeCercato != "") {
        const nomeFormattato =
          nomeCercato[0].toUpperCase() + nomeCercato.slice(1).toLowerCase();
        this.contacts.forEach((contatto) => {
          if (!contatto.name.includes(nomeFormattato)) {
            contatto.visible = false;
          } else {
            contatto.visible = true;
          }
        });
      } else {
        this.contacts.forEach((contatto) => {
          contatto.visible = true;
        });
      }
    },
    // CANCELLA MESSAGGIO
    deleteMessage(messaggio) {
      if (this.contacts[this.activeUser].messages.length > 0) {
        this.contacts[this.activeUser].messages.splice(messaggio, 1);
      }
    },
    // CANCELLA TUTTI I MESSAGGI DELLA CHAT
    deleteAllMessages() {
      this.contacts[this.activeUser].messages = [];
    },
    // CANCELLA UN CONTATTO
    deleteContact() {
      if (this.contacts.length > 0) {
        this.contacts.splice(this.activeUser, 1);
      }
    },
    // FUNZIONE PER FARE IL PARSING DELLE DATE IN FORMATO ACCETTABILE DA LUXON
    timeParseFull(time) {
      const data = {
        anno: luxon.DateTime.fromFormat(time, "dd/LL/yyyy hh:mm:ss").toFormat(
          "yyyy"
        ),
        mese: luxon.DateTime.fromFormat(time, "dd/LL/yyyy hh:mm:ss").toFormat(
          "LL"
        ),
        giorno: luxon.DateTime.fromFormat(time, "dd/LL/yyyy hh:mm:ss").toFormat(
          "dd"
        ),
        ore: luxon.DateTime.fromFormat(time, "dd/LL/yyyy hh:mm:ss").toFormat(
          "HH"
        ),
        minuti: luxon.DateTime.fromFormat(time, "dd/LL/yyyy hh:mm:ss").toFormat(
          "mm"
        ),
        secondi: luxon.DateTime.fromFormat(
          time,
          "dd/LL/yyyy hh:mm:ss"
        ).toFormat("ss"),
      };
      return data;
    },

    // OTTIENE LA DATA DELL'ULTIMO MESSAGGIO
    getLastMessage(utente) {
      if (utente.messages.length > 0) {
        let lastMessage;
        let lastInterval = 0;
        // CICLO MESSAGGI
        utente.messages.forEach((messaggio) => {
          // CONVERTO DATA MESSAGGI IN DATA UTILE PER IL CONFRONTO
          let dataMessaggio = this.timeParseFull(messaggio.date);
          let dataMessaggioFormattata = luxon.DateTime.local(
            parseInt(dataMessaggio.anno),
            parseInt(dataMessaggio.mese),
            parseInt(dataMessaggio.giorno),
            parseInt(dataMessaggio.ore),
            parseInt(dataMessaggio.minuti),
            parseInt(dataMessaggio.secondi)
          );
          let dataOdierna = luxon.DateTime.now();
          // VERIFICO L'INTERVALLO TRA LE DUE DATE IN MS
          const differenzaDate = luxon.Interval.fromDateTimes(
            dataMessaggioFormattata,
            dataOdierna // 1000
          ).length("milliseconds");
          // SE LA DIFFERENZA E' MAGGIORE, AGGIORNA SOLO IL LASTINTERVAL
          if (differenzaDate < lastInterval) {
            lastInterval = differenzaDate;
            lastMessage = messaggio;
          } else {
            // ALTRIMENTI RECUPERA ANCHE IL MESSAGGIO
            lastInterval = differenzaDate;
            lastMessage = messaggio;
          }
        });
        // RITORNA L'OGGETTO DATA DELL'ULTIMO MESSAGGIO
        return this.timeParseFull(lastMessage.date);
      }
    },
    loadEmoji() {
      new EmojiPicker({
        trigger: [
          {
            selector: ".fa-face-smile",
            insertInto: [".chat-bar"], // '.selector' can be used without array
          },
        ],
        closeButton: true,
        //specialButtons: green
      });
    },
  },
  created() {
    this.loadEmoji();
  },
}).mount("#root");
