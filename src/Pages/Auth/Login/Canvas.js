export function animatiion() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particleArray;

  let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80),
  };

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    //method to draw individual particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    //check particle position, check mouse position, move the particle, draw the particle
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }
      let dx = mouse.x - this.x;

      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 10;
          this.directionX = -this.directionX;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
          this.directionX = -this.directionX;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 10;
          this.directionY = -this.directionY;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
          this.directionY = -this.directionY;
        }
      }
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function init() {
    particleArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000 < 150 ? (canvas.height * canvas.width) / 9000 : 150;
    for (let i = 0; i < numberOfParticles * 2; i++) {
      let size = Math.random() * 5 + 1;
      let x = Math.random() * (window.innerWidth - size * 2) + size * 2;
      let y = Math.random() * (window.innerHeight - size * 2) + size * 2;
      let directionX = Math.random() * 5 - 2.5;
      let directionY = Math.random() * 5 - 2.5;
      let color = 'white';
      particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
    console.log(particleArray.length);
  }
  //   var stop = false;
  //   var frameCount = 0;
  //   var $results = $('#results');
  //  fpsInterval, startTime, now, then, elapsed;

  //   // initialize the timer variables and start the animation

  //   function startAnimating(fps) {
  //     fpsInterval = 1000 / fps;
  //     then = Date.now();
  //     startTime = then;
  //     animate();
  //   }
  const fps = 25;
  function animate() {
    // requestAnimationFrame(animate);
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000 / fps);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
    connect();

    // requestAnimationFrame(animate);

    // // calc elapsed time since last loop

    // now = Date.now();
    // elapsed = now - then;

    // // if enough time has elapsed, draw the next frame

    // if (elapsed > fpsInterval) {
    //   // Get ready for next frame by setting then=now, but also adjust for your
    //   // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    //   then = now - (elapsed % fpsInterval);

    //   // Put your drawing code here
    // }
  }
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
      for (let b = a; b < particleArray.length; b++) {
        let distance =
          (particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x) +
          (particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y);
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          opacityValue = 1 - distance / 20000;
          ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleArray[a].x, particleArray[a].y);
          ctx.lineTo(particleArray[b].x, particleArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80);
    init();
  });
  window.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  init();

  animate();
}
