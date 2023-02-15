const { createApp } = Vue;

createApp({
  data() {
    return {
      contacts: [
        {
          name: "Michele",
          avatar: "_1",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Hai portato a spasso il cane?",
              status: "sent",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "Ricordati di stendere i panni",
              status: "sent",
            },
            {
              date: "10/01/2020 16:15:22",
              text: "Tutto fatto!",
              status: "received",
            },
          ],
        },
        {
          name: "Fabio",
          avatar: "_2",
          visible: true,
          messages: [
            {
              date: "20/03/2020 16:30:00",
              text: "Ciao come stai?",
              status: "sent",
            },
            {
              date: "20/03/2020 16:30:55",
              text: "Bene grazie! Stasera ci vediamo?",
              status: "received",
            },
            {
              date: "20/03/2020 16:35:00",
              text: "Mi piacerebbe ma devo andare a fare la spesa.",
              status: "sent",
            },
          ],
        },
        {
          name: "Samuele",
          avatar: "_3",
          visible: true,
          messages: [
            {
              date: "28/03/2020 10:10:40",
              text: "La Marianna va in campagna",
              status: "received",
            },
            {
              date: "28/03/2020 10:20:10",
              text: "Sicuro di non aver sbagliato chat?",
              status: "sent",
            },
            {
              date: "28/03/2020 16:15:22",
              text: "Ah scusa!",
              status: "received",
            },
          ],
        },
        {
          name: "Alessandro B.",
          avatar: "_4",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Lo sai che ha aperto una nuova pizzeria?",
              status: "sent",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "Si, ma preferirei andare al cinema",
              status: "received",
            },
          ],
        },
        {
          name: "Alessandro L.",
          avatar: "_5",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Ricordati di chiamare la nonna",
              status: "sent",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "Va bene, stasera la sento",
              status: "received",
            },
          ],
        },
        {
          name: "Claudia",
          avatar: "_6",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Ciao Claudia, hai novità?",
              status: "sent",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "Non ancora",
              status: "received",
            },
            {
              date: "10/01/2020 15:51:00",
              text: "Nessuna nuova, buona nuova",
              status: "sent",
            },
          ],
        },
        {
          name: "Federico",
          avatar: "_7",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Fai gli auguri a Martina che è il suo compleanno!",
              status: "sent",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "Grazie per avermelo ricordato, le scrivo subito!",
              status: "received",
            },
          ],
        },
        {
          name: "Davide",
          avatar: "_8",
          visible: true,
          messages: [
            {
              date: "10/01/2020 15:30:55",
              text: "Ciao, andiamo a mangiare la pizza stasera?",
              status: "received",
            },
            {
              date: "10/01/2020 15:50:00",
              text: "No, l'ho già mangiata ieri, ordiniamo sushi!",
              status: "sent",
            },
            {
              date: "10/01/2020 15:51:00",
              text: "OK!!",
              status: "received",
            },
          ],
        },
      ],
      activeUser: 0,
      newMessage: "",
      searchText: "",
      activeMessage: "",
    };
  },
  methods: {
    logga(qualcosa) {
      console.log(qualcosa);
    },
    addMessage(messaggio, utente) {
      const currentDate = new Date();
      const timeStamp =
        currentDate.getDate() +
        "/" +
        (currentDate.getMonth() + 1) +
        "/" +
        currentDate.getFullYear() +
        " " +
        currentDate.getHours() +
        ":" +
        currentDate.getMinutes() +
        ":" +
        currentDate.getSeconds();

      const nuovoMessaggio = {
        date: timeStamp,
        text: messaggio,
        status: "sent",
      };
      this.contacts[utente].messages.push(nuovoMessaggio);
      this.newMessage = "";
      setTimeout(() => this.reply(utente, timeStamp), 1000);
    },
    reply(user, time) {
      const rispostaText = {
        date: time,
        text: "OK",
        status: "received",
      };
      this.contacts[user].messages.push(rispostaText);
    },
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
    deleteMessage(messaggio) {
      this.contacts[this.activeUser].messages.splice(messaggio, 1);
    },
    // FUNZIONE PER FARE IL PARSING DELLE DATE IN FORMATO ACCETTABILE DA LUXON
    timeParseFull(time) {
      const data = {
        anno: luxon.DateTime.fromFormat(time, "dd/mm/yyyy hh:mm:ss").toFormat(
          "yyyy"
        ),
        mese: luxon.DateTime.fromFormat(time, "dd/mm/yyyy hh:mm:ss").toFormat(
          "LL"
        ),
        giorno: luxon.DateTime.fromFormat(time, "dd/mm/yyyy hh:mm:ss").toFormat(
          "dd"
        ),
        ore: luxon.DateTime.fromFormat(time, "dd/mm/yyyy hh:mm:ss").toFormat(
          "HH"
        ),
        minuti: luxon.DateTime.fromFormat(time, "dd/mm/yyyy hh:mm:ss").toFormat(
          "mm"
        ),
        secondi: luxon.DateTime.fromFormat(
          time,
          "dd/mm/yyyy hh:mm:ss"
        ).toFormat("ss"),
      };
      return data;
    },
    getLastMessage(utente) {
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
          dataOdierna
        ).length("milliseconds");
        // SE LA DIFFERENZA E' MAGGIORE, AGGIORNA SOLO IL LASTINTERVAL
        if (differenzaDate > lastInterval) {
          lastInterval = differenzaDate;
        } else {
          // ALTRIMENTI RECUPERA ANCHE IL MESSAGGIO
          lastInterval = differenzaDate;
          lastMessage = messaggio;
        }
      });
      // RITORNA L'OGGETTO DATA DELL'ULTIMO MESSAGGIO
      return this.timeParseFull(lastMessage.date);
    },
  },
  created() {},
}).mount("#root");
