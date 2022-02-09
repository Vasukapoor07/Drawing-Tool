let canvas = document.querySelector("canvas")
let tool = canvas.getContext("2d")
let startgameButton = document.querySelector("#startGamebutton")
let modelEl = document.querySelector("#modelEl")
let updateScore = document.querySelector("#updateScore")
// Window.innerHeight and innerWidth is whole window of brower that's left on brower
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


let scoreEl = document.querySelector('#scoreEl')

// Here in this class what is this doing is creating our player
class Player {
    /* In this constructor what we are doing is making attributes of player which can be used to
       to define our player */
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    // By the help of this draw function we are making that circle
    draw() {
        tool.beginPath();
        tool.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        tool.fillStyle = this.color;
        tool.fill();
    }
}

// Here now we want to shoot the projectile in whatever direction we want so do it what we will do.
class Projectile {
    /* Projectile's properties are same as the player but the only difference b/w then is that 
       we have to shoot the projectile and the direction of that projectile is define by velocity */
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    // Draw the projectile using tool.arc func
    draw() {
        tool.beginPath();
        tool.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        tool.fillStyle = this.color;
        tool.fill();
    }

    /* What we are doing in this update is that first we are drawing the projectile then after
       that we are updating our values of x and y or can say coordinates of projectile */
    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

/* Every thing is same as of projectile but the only diiference b/w them is that enemy are 
   coming randomly from every direction and these enemies are also taking color randomly */
class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        tool.beginPath();
        tool.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        tool.fillStyle = this.color;
        tool.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

let friction = 0.99
// This class is dividing the enemy into so many small particles and sending them into every direction 
class Particle {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        tool.save()
        tool.globalAlpha = this.alpha
        tool.beginPath()
        tool.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        tool.fillStyle = this.color
        tool.fill()
        tool.restore()
    }

    update() {
        this.draw()
        // To slow the particle that are breaking so we will use friction to slow it down
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}


let x = canvas.width / 2
let y = canvas.height / 2
let player
let score
let projectiles 
let enemies 
let particles 

function init(){
    player = new Player(x, y, 10, "white")
    score = 0
    projectiles = []
    enemies = []
    particles = []
}

// The enemy are spawing by the help of this function and also they are generating randomly.
function enemyspawn() {
    /* By the help of this setInterval function what we are doing is sending the enemies after 
       particular time and that time is 1000ms = 1sec
    */ 
    setInterval(() => {
        /* Here what we are doing is that we are setting our maximum and minimum as we know that Math.random() is 
        giving values between 0 to 1 so we don't want our enemy too small so what we would is set min and max
        so we by multiplying (30 - 4) here even if random is 0 our min will be 4 and max will be 30 if random=1 
        so that the enemy that comes through are of different sizes. */
        let radius = Math.random() * (30 - 4) + 4;
        let x
        let y
        /* Now x, y = 0 is top left corner so  0-radius means is that we are starting from top and y will be by 
          canavs.height which will be multiplying by Math.random() which will make it from (0, canvas.height)  
          that's why we have two two condition for each so that our enemy can come through every direction
          top, bottom, left, right */
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height
        } else {
        x = Math.random() * canvas.width 
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        /* hue saturation(how deep is that color) lightest(how bright we want our color to be)
        and here what we want is that our enemies color should be random and to that what we 
        will do is h can vary from 1 to 360 these are the range of color in hsl */ 
        let color =  `hsl(${Math.random() * 360}, 50%, 50%)`
        // This is templet literal ${ } use when we want put values inside the string 
        let angle = Math.atan2(
            canvas.height / 2 - y, 
            canvas.width / 2 - x
        )
        let velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

let animationId;
// Every thing that we are seeing on the screen is coming from this animate function 
function animate(){
    /* requestAnimationFrame() => it gives us the value of frame if we want and putting it in
       into animationId which come handy to stop the game because what it will do is stop that 
       paricular frame when the enemy will hit the player that's the place when we will stop 
       our game */
    animationId = requestAnimationFrame(animate)
    // And what this requestAnimationFrame() is doing is processing the frame it means everything will come frame by frame
    /* What we are doing here is that we are clearing whole canvas like putting the white rectangle above everthing
    then question should be how the hell is we are making those projectile moving the ans should be that at a 
    single time we are making so many instance(projectiles) mtlb ye ki jo humne phele shoot krre the jiss direction me vo 
    direction toh hei he humare pass vo toh lost nhi hui toh esse essa samjh lo ki mann lo humare pass 7 direction 
    hei toh phir humm se 7 circle ban jaenge phir vo clear react krr dega aur usse badi baat humari values jo
    hei vo update ho chuki hongi toh jaisa ki humm dekh sakte hei ki player draw hoga player.draw() se aur uske
    baad again humare projectiles honge aur phir values update then again clearReact() call hoga aur then again playerDraw()
    so this is what happening here. 
    // tool.clearRect(0, 0, canvas.width, canvas.height);
    So what are we doing here is that while doing this clearRect we are putting white color 
    so to make look good what we will do is make it some other color */
    tool.fillStyle = "rgba(0, 0, 0, 0.1)"
    // this aplha = 0.1 is giving us that effect on projectilies and enemies 
    tool.fillRect(0, 0, canvas.width, canvas.height);
    player.draw()
    particles.forEach((particle, index) => {
        if(particle.alpha < 0){
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })
    // Loop through all projectiles
    projectiles.forEach(function(projectile, index){
        projectile.update();
        
        /* What we are doing here is that we have to remove the projectile so that our game works
        fast otherwise what will happen is that projectiles.length will keep on increasing 
        and it will be slow after shooting many projectiles */
        if(projectile.x + projectile.radius < 0 || 
           projectile.y + projectile.radius < 0 ||
           projectile.x + projectile.radius > canvas.width || 
           projectile.y + projectile.radius > canvas.height){
                /* What we are doing here is removing the projectile that has crossed those above condition
                   so that our game runs faster that's why we remove the projectile from projectiles so that 
                   its getting empty and only those count which are on the screen. */
                setTimeout(() => {
                    projectiles.splice(index, 1)
                }, 0)
            }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()
        let dist = Math.hypot(player.x - enemy.x, 
            player.y - enemy.y)

        if(dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId)
            updateScore.innerHTML = score
            modelEl.style.display = "flex"
        }

        projectiles.forEach((projectile, projectileIndex) => {
            // To remove the projectile after collision first we need to check the below condition
            let dist = Math.hypot(projectile.x - enemy.x, 
                projectile.y - enemy.y)
            if (dist - projectile.radius - enemy.radius < 1){
                // score += 100
                // scoreEl.innerHTML = score
                // Here we are breaking our enemy into pieces
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particle(
                        projectile.x, 
                        projectile.y, 
                        Math.random() * 2,  // what we are doing here is the particles that are breaking we are making their radius randomly
                        enemy.color,
                        {
                            // And this is the main thing becoz this is what sending the particle in all directions 
                            // To make the speed to those partile random what we are doing is choose them randomly 
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6)
                        }
                    ))
                    
                }
                // Converting bigger particles into smaller one
                if (enemy.radius - 10 > 10){
                    // Shrinking of particle is hapening here
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    }) 
                    /* The question that should be coming into mind is why we only removing projection the ans is that
                       because as we know that above we are shrinking our enemy so it doesnot destroy so we can't remove 
                       it from enemies but we have used our projectile for shrinking purpose... */ 
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        score += 250
                        scoreEl.innerHTML = score
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }    
        })
    }) 
}

addEventListener("click", function(e){ 
    let angle = Math.atan2(
        e.clientY - canvas.height / 2, 
        e.clientX - canvas.width / 2
    )
    let velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(
        canvas.width / 2, 
        canvas.height / 2, 
        5, 
        "white", 
        velocity))
})


startgameButton.addEventListener("click", function(){ 
    init()
    animate()
    enemyspawn()
    modelEl.style.display = "none"
})
 