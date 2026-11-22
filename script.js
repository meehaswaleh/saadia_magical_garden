const enterButton = document.getElementById('enterButton');
    const welcome = document.getElementById('welcome');
    const gardenScreen = document.getElementById('gardenScreen');
    const flowerBed = document.getElementById('flowerBed');
    const garden = document.getElementById('garden');

    const flowerColors = [
      ['#fff0f6','#e99fc5'], ['#f7edff','#bca1e5'], ['#fff4e8','#e8b5c7'],
      ['#f8eaff','#d3a9dc'], ['#fff1f5','#d985b5'], ['#f4efff','#a995d5'],
      ['#fff4eb','#e6b3a0'], ['#fff0f8','#c982b3'], ['#f4edff','#b9a4df']
    ];

    function makeFlower(index) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      const height = 125 + ((index * 37) % 125);
      flower.style.setProperty('--height', height + 'px');
      flower.style.setProperty('--delay', (index * -.47) + 's');
      const stem = document.createElement('div'); stem.className = 'stem';
      const leaf1 = document.createElement('span'); leaf1.className = 'leaf left';
      const leaf2 = document.createElement('span'); leaf2.className = 'leaf right';
      const bloom = document.createElement('div'); bloom.className = 'bloom';
      const [pale, petal] = flowerColors[index % flowerColors.length];
      for (let i=0;i<8;i++) {
        const part = document.createElement('span'); part.className = 'petal';
        part.style.setProperty('--pale', pale); part.style.setProperty('--petal', petal);
        part.style.transform = `translate(-50%,-100%) rotate(${i*45}deg)`;
        bloom.appendChild(part);
      }
      const center = document.createElement('span'); center.className = 'center'; bloom.appendChild(center);
      flower.append(stem,leaf1,leaf2,bloom); flowerBed.appendChild(flower);
      setTimeout(() => bloom.classList.add('open'), 500 + index * 180);
    }

    function addFireflies() {
      for (let i=0;i<24;i++) {
        const dot = document.createElement('span'); dot.className = 'firefly';
        dot.style.left = (5 + Math.random()*90) + '%';
        dot.style.top = (12 + Math.random()*72) + '%';
        dot.style.animationDelay = (-Math.random()*7) + 's';
        dot.style.animationDuration = (4 + Math.random()*5) + 's';
        garden.appendChild(dot);
      }
    }

    enterButton.addEventListener('click', () => {
      welcome.style.display = 'none';
      gardenScreen.classList.add('show');
      for (let i=0;i<11;i++) makeFlower(i);
      addFireflies();
      window.scrollTo({top:0,behavior:'smooth'});
    });

    document.getElementById('petalButton').addEventListener('click', () => {
      for (let i=0;i<28;i++) {
        const petal = document.createElement('span');
        petal.className = 'petal-fall';
        petal.textContent = ['✿','❀','❁'][i%3];
        petal.style.left = Math.random()*100 + 'vw';
        petal.style.fontSize = (12+Math.random()*16) + 'px';
        petal.style.animationDuration = (5+Math.random()*6) + 's';
        document.body.appendChild(petal);
        setTimeout(()=>petal.remove(),12000);
      }
    });

    // A gentle original ambient melody made in the browser; no external music file needed.
    let audioContext, masterGain, musicTimer, noteIndex = 0;
    const notes = [261.63,329.63,392.00,329.63,293.66,349.23,440.00,349.23];
    function playNote() {
      if (!audioContext || !masterGain) return;
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[noteIndex % notes.length];
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + .7);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(now); osc.stop(now + 3.5);
      noteIndex++;
    }
    const musicButton = document.getElementById('musicButton');
    musicButton.addEventListener('click', async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = .65;
        masterGain.connect(audioContext.destination);
      }
      if (audioContext.state === 'suspended') await audioContext.resume();
      if (musicTimer) {
        clearInterval(musicTimer); musicTimer = null;
        masterGain.gain.setTargetAtTime(0, audioContext.currentTime, .2);
        musicButton.textContent = '♫ Turn on soft music';
        musicButton.setAttribute('aria-pressed','false');
      } else {
        masterGain.gain.setTargetAtTime(.65, audioContext.currentTime, .3);
        playNote(); musicTimer = setInterval(playNote, 1700);
        musicButton.textContent = '♫ Turn off music';
        musicButton.setAttribute('aria-pressed','true');
      }
    });
