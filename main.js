        const NUM_DADI = 5;
        const FACCE_DADO = 6;
        const MIN_DADO = 6;
        const ELEMENTI_TAB = 14;
        const T_LANCIO = 1000;
        const VEL_ANIMAZIONE_DADI = 50;
        const P_FULL = 25;
        const P_SCALA = 40;
        const P_YATHZEE = 50;

        let coloreDado = "W";

        let staLanciando = false; //evita accessi contemporanei
        let turnoFinale = false;
        let lanciDisp = 3;
        let giocatore = 1; //turno del giocatore
        let dadi = [0,0,0,0,0] //salvo il valore dei dadi;
        let pP1 = 0;
        let pP2 = 0;
        let cP1 = 0; // c = numero caselle riempite
        let cP2 = 0; 
        //elenco id categorie
        const categoria = 
        [
          "uno", "due", "tre", "quattro", "cinque", "sei", 
          "coppia", "doppiacoppia", "tris", "poker", 
          "full", "chance", "scala", "yahtzee"
        ];

        function impostazioniIniziali()
        {
          p1 = document.getElementById("inizio-p1").value;
          p2 = document.getElementById("inizio-p2").value;
          if(p1=="" || p2=="") 
          {
            alert("I campi non possono essere vuoti") 
            return;
          }
          document.getElementById("textGiocatore").innerText=p1;
          document.getElementById("g1").innerText=p1;
          document.getElementById("g2").innerText=p2;
          document.getElementById("inizio-overlay").style.display="none";
        }

        function lanciaDadi()
        {
          if(!staLanciando)
          {
            staLanciando=true;
            let x = setInterval(lancio,VEL_ANIMAZIONE_DADI);
            setTimeout(() => { //animazione lancio dadi
                clearInterval(x);
                lancio();      
                staLanciando = false; 
                calcolaPunteggi();
                lanciDisp--;
                document.getElementById("info").innerText= "premi i dadi da bloccare, rimanenti: " + lanciDisp;
                //fine lanci
                if(lanciDisp == 0)
                {
                  document.getElementById("lancioDadi").setAttribute("disabled","")
                  for(let i=0; i<NUM_DADI; i++){
                    let dado = document.getElementById("d" + (i+1));
                    if(dado.classList.contains("selected")) dado.classList.remove("selected")
                  }
                }
            }, T_LANCIO);
          }
        }

        function lancio(){
          for(let i=0; i<NUM_DADI; i++){
            let dado = document.getElementById("d" + (i+1));
            if(!dado.classList.contains("selected")) //blocco le selezionate
            {
              let d = Math.floor(Math.random()*FACCE_DADO)+1;
              dadi[i] = d;
              let percorso = "img/dado/" + coloreDado + (d) + ".svg"
              document.getElementById("d"+ (i+1)).src = percorso;
            }
          }
        }

        function fissa(x){
          //se hai già lanciato e hai ancora lanci a disposizione puoi fissare
          if(lanciDisp<3 && lanciDisp>0) 
            x.classList.toggle("selected"); //attiva/disattiva la classe selected
        }

        function calcolaPunteggi()
        {
          let rip = [0,0,0,0,0,0];

          //Conto ripetizioni
          for(let i=0; i<NUM_DADI; i++)
          {
            if(dadi[i] == 1) rip[0]++;
            if(dadi[i] == 2) rip[1]++;
            if(dadi[i] == 3) rip[2]++;
            if(dadi[i] == 4) rip[3]++;
            if(dadi[i] == 5) rip[4]++;
            if(dadi[i] == 6) rip[5]++;
          }
          
          let tris = 0;
          let poker = 0;
          let contaCoppie = 0;
          let maxCoppia = 0;
          let sommaCoppie = 0;
          let sommaDadi = 0;
          let yahtzee = 0;
          let full = 0;
          let scala = 0;

          for (let i=0; i<FACCE_DADO; i++) 
          {
            if (rip[i] >= 2) 
            {
              contaCoppie++;
              maxCoppia = (i+1)*2;
              sommaCoppie += maxCoppia;
            }
            if (rip[i] >= 3) tris = (i+1)*3;
            if (rip[i] >= 4) poker = (i+1)*4;
            if (rip[i] == 5) yahtzee = P_YATHZEE;
            sommaDadi += (i+1)*rip[i];
          }
          if(contaCoppie != 2) sommaCoppie = 0;
          if(rip.includes(2) && rip.includes(3)) full = P_FULL;
          if((rip[0] && rip[1] && rip[2] && rip[3] && rip[4]) || (rip[1] && rip[2] && rip[3] && rip[4] && rip[5])) scala = P_SCALA;
          

          for(let i=0; i<FACCE_DADO; i++)
          {
            let cella = document.getElementById(categoria[i] + "-p" + giocatore);
            if (!cella.classList.contains("bloccato")) cella.innerText = rip[i]*(i+1);
          };

          //COPPIA
          if(!document.getElementById("coppia-p" + giocatore).classList.contains("bloccato")) document.getElementById("coppia-p" + giocatore).innerText = maxCoppia;

          //DOPPIA COPPIA
          if(!document.getElementById("doppiacoppia-p" + giocatore).classList.contains("bloccato")) document.getElementById("doppiacoppia-p" + giocatore).innerText = sommaCoppie;

          //TRIS
          if(!document.getElementById("tris-p" + giocatore).classList.contains("bloccato")) document.getElementById("tris-p" + giocatore).innerText = tris;
          
          //POKER
          if(!document.getElementById("poker-p" + giocatore).classList.contains("bloccato"))document.getElementById("poker-p" + giocatore).innerText = poker;
          
          //FULL
          if(!document.getElementById("full-p" + giocatore).classList.contains("bloccato")) document.getElementById("full-p" + giocatore).innerText = full;

          //CHANCE
          if(!document.getElementById("chance-p" + giocatore).classList.contains("bloccato")) document.getElementById("chance-p" + giocatore).innerText = sommaDadi;

          //SCALA
          if(!document.getElementById("scala-p" + giocatore).classList.contains("bloccato")) document.getElementById("scala-p" + giocatore).innerText = scala;

          //YAHTZEE
          if(!document.getElementById("yahtzee-p" + giocatore).classList.contains("bloccato")) document.getElementById("yahtzee-p" + giocatore).innerText = yahtzee;
        }

        function segnaPunteggio(x)
        {
          //uscita se non è il proprio turno
          if((x.id.includes("1") && giocatore != 1) || (x.id.includes("2") && giocatore != 2))
          return;

          g = document.getElementById("textGiocatore");

          if(giocatore == 1) 
          {
            pP1 += parseInt(x.innerText);
            cP1++;
          }
          else if(giocatore == 2) 
          {
            pP2 += parseInt(x.innerText);
            cP2++;
          }
          x.classList.add("bloccato");
          x.style.backgroundColor = "var(--main)";
          x.onclick = null;

          if(cP1 == ELEMENTI_TAB && cP2 == ELEMENTI_TAB)
          {
            if(pP1==pP2) mostraVittoria(0);
            else if(pP1>pP2) mostraVittoria(1);
            else mostraVittoria(2);
          }

          //cambio turno
          lanciDisp = 3;
          dadi = [1,2,3,4,5];
          document.getElementById("info").innerText="Lancia per iniziare, rimanenti: 3";
          pulisciTabella(giocatore);

          for(let i=0; i<NUM_DADI; i++)
          {
            let dado = document.getElementById("d" + (i+1));
            if(dado.classList.contains("selected")) dado.classList.remove("selected");
          }

          if(giocatore == 2)
          {
            giocatore = 1;
            g.innerText=p1;
            document.getElementById("numeroSfondo").innerText = pP1.toString().padStart(2, '0');
            if(pP1>100) document.getElementById("numeroSfondo").style.fontSize = "250px";
            else document.getElementById("numeroSfondo").style.fontSize = "400px";
          }
          else
          {
            giocatore = 2;
            g.innerText=p2;
            document.getElementById("numeroSfondo").innerText = pP2.toString().padStart(2, '0');
            if(pP2>100) document.getElementById("numeroSfondo").style.fontSize = "250px";
            else document.getElementById("numeroSfondo").style.fontSize = "400px";
          }
          document.getElementById("lancioDadi").removeAttribute("disabled");
        }

        function pulisciTabella(giocatore) 
        {
          //per ogni elemento di categoria prendo l'id e se non è bloccato lo resetto
          for(let i=0; i<categoria.length; i++)
          {
            let cella = document.getElementById(categoria[i] + "-p" + giocatore);
            if (!cella.classList.contains("bloccato")) cella.innerText = 0;
          };
        }

        function cambiaTema(x) {
          let coloreScelto = window.getComputedStyle(x).backgroundColor;
          document.documentElement.style.setProperty('--main', coloreScelto);
        }

        function cambiaDado(x) {
          coloreDado = x.id;
          for(let i=0; i<NUM_DADI; i++)
        {
          document.getElementById("d" + (i+1)).src="img/dado/" + coloreDado + (i+1) + ".svg";
        }
        }

        function mostraVittoria(vincitore) 
        {
          if(vincitore == 0)
          {
            document.getElementById("vittoria-titolo").innerText = "Pareggio!";
            document.getElementById("vittoria-messaggio").innerText = "Parità, gioca ancora per decretare il vero vincitore!";
            document.getElementById("vittoria-punteggio").innerText = pP1 + " - " + pP2;         
          }
          else
          {
            document.getElementById("vittoria-titolo").innerText = "Vittoria!";
            if(vincitore == 1) document.getElementById("vittoria-messaggio").innerText = p1 + " ha vinto la partita!";
            else if(vincitore == 2) document.getElementById("vittoria-messaggio").innerText = p2 + " ha vinto la partita!";
            document.getElementById("vittoria-punteggio").innerText = pP1 + " - " + pP2;
          }
          
          // Mostra l'overlay usando flex per centrare
          document.getElementById("vittoria-overlay").style.display = "flex";
        }