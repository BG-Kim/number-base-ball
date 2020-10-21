
// BGKim 
// modify origin source for multi character
// origin : https://gist.github.com/sujumayas/bff94841d45830064d24246971480075
function getParticleTextInstance() {
	return  {
	  Particle: function(x, y) {
	    this.x = x;
	    this.y = y;
	    this.radius = 2;
	    this.draw = function(ctx) {
	      ctx.save();
	      ctx.translate(this.x, this.y);
	      ctx.fillStyle = 'white';
	      ctx.fillRect(0, 0, this.radius, this.radius);
	      ctx.restore();
	    };
	  },
	  init: function() {
	    particleText.canvas = document.querySelector('canvas');
	    particleText.ctx = particleText.canvas.getContext('2d');
	    particleText.W = particleText.canvas.width;
	    particleText.H = particleText.canvas.height;
	    particleText.particlePositions = [];
	    particleText.particles = [];
	    particleText.tmpCanvas = document.createElement('canvas');
	    particleText.tmpCtx = particleText.tmpCanvas.getContext('2d');
	    particleText.keyword = "";
	   
	  
	    particleText.getPixels(particleText.tmpCanvas, particleText.tmpCtx);
	    
	    particleText.makeParticles(1000);
	    particleText.animate();
	  },   
	  makeParticles: function(num) {
	    for (var i = 0; i <= num; i++) {
	      particleText.particles.push(
	        new particleText.Particle(particleText.W / 2 + Math.random() * 400 - 200, particleText.H / 2 + Math.random() * 400 -200)
	      );
	    }
	  },
	  getPixels: function(canvas, ctx) {
	    //var keyword = particleText.time,
	    let keyword = particleText.keyword;
	    let gridX = 3;
	    let gridY = 3;
	    canvas.width = particleText.W;
	    canvas.height = particleText.H;
	    ctx.fillStyle = 'red';
	    ctx.font = 'italic bold 100px Noto Serif';    
	    ctx.fillText(keyword, canvas.width / 2 - ctx.measureText(keyword).width / 2 - 10, canvas.height / 2 + 35 );
	    var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    var buffer32 = new Uint32Array(idata.data.buffer);
	    if (particleText.particlePositions.length > 0) particleText.particlePositions = [];
	    for (var y = 0; y < canvas.height; y += gridY) {
	      for (var x = 0; x < canvas.width; x += gridX) {
	        if (buffer32[y * canvas.width + x]) {
	          particleText.particlePositions.push({x: x, y: y});
	        }
	      }
	    }
	  },
	  animateParticles: function() {
	    var p, pPos;
	    for (var i = 0, num = particleText.particles.length; i < num; i++) {
	      p = particleText.particles[i];
	      pPos = particleText.particlePositions[i];
	      if (particleText.particles.indexOf(p) === particleText.particlePositions.indexOf(pPos)) {
	      p.x += (pPos.x - p.x) * .5;
	      p.y += (pPos.y - p.y) * .5;
	      p.draw(particleText.ctx);
	    }
	    }
	  },
	  animate: function() {
	    requestAnimationFrame(particleText.animate);
	    particleText.ctx.fillStyle = 'rgba(23, 41, 58, .8)';
	    particleText.ctx.fillRect(0, 0, particleText.W, particleText.H);
	    particleText.animateParticles();
	  },
	  setText(keyword) {
	    particleText.keyword = keyword;
	    particleText.getPixels(particleText.tmpCanvas, particleText.tmpCtx);
	  }
	}
}

