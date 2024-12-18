'use client';
import React, { useEffect, useRef, useState } from 'react';
import idle from '@/images/Character/Jump (32x32).png';

class Player {
    position: { x: number, y: number };
    velocity: {x: number, y: number};
    jumpHeight: number;
    gravity: number;
    friction: number;
    width: number;
    height: number;
    gameOver: boolean;
    isGrounded: boolean;
    abilityCooldown: boolean;
    abiltyCooldownTime: number;
    lastAbility: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.jumpHeight = -25;
        this.gravity = 1;
        this.friction = 0;
        this.width = width;
        this.height = height;
        this.gameOver = false;
        this.isGrounded = false;
        this.abilityCooldown = false;
        this.abiltyCooldownTime = 3000;
        this.lastAbility = 0;
    }

    jump() {
        if (this.isGrounded) {  
            this.velocity.y = this.jumpHeight;
            this.isGrounded = false;
        }
    }

    moveLeft() {
        this.velocity.x = -5;
    }

    moveRight() {
        this.velocity.x = 5;
    }

    dash() {
        this.velocity.x = 30;
        console.log('dashing');
        
    }

    update(platforms: Platform[], obstacles: Obstacle[]): void {
        if (this.gameOver) return;
        this.isGrounded = false;

        platforms.forEach((platform) => {
            if (this.checkCollision(platform)) {
                if (this.velocity.y > 0) {
                    this.position.y = platform.position.y - this.height;
                    this.friction += this.velocity.x;
                    this.velocity.x = 0;
                    this.isGrounded = true;
                }
                const isBottomCollision =
                this.position.y >= platform.position.y + platform.height &&
                this.position.y + this.velocity.y <= platform.position.y + platform.height;
                if (isBottomCollision) {
                    this.velocity.y = 0;
                    this.position.y = platform.position.y + platform.height;
                }
            }
        });
        if (!this.isGrounded) {
            this.velocity.y += this.gravity;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
        
        
        else if (this.isGrounded){
            this.position.x += this.friction;
            if (this.friction > 0){
                this.friction -= 0.5;
            } else if (this.friction < 0){
                this.friction += 0.5;
            }
        }
        const currentTime = Date.now();

       if (!this.abilityCooldown || currentTime - this.lastAbility > this.abiltyCooldownTime) {
           console.log('Ability used!');
           this.lastAbility = currentTime;
           this.abilityCooldown = true;

           setTimeout(() => {
               this.abilityCooldown = false;
               console.log('Ability cooldown complete!');
           }, this.abiltyCooldownTime);

        } else {
            console.log('Ability is on cooldown!');
        }
        
        if (this.position.y + this.height > window.innerHeight) {
            this.gameOver = true;
        }
    }

    checkCollision(platform: Platform): boolean {
        const isHorizontalCollision =
            this.position.x + this.width > platform.position.x &&
            this.position.x < platform.position.x + platform.width;

        const isVerticalCollision =
            this.position.y + this.height <= platform.position.y &&
            this.position.y + this.height + this.velocity.y >= platform.position.y;
            
        // Still needed even if it is implemented again in the update function.
        const isBottomCollision =
            this.position.y >= platform.position.y + platform.height &&
            this.position.y + this.velocity.y <= platform.position.y + platform.height;

        return (isHorizontalCollision && isVerticalCollision) ||
         (isHorizontalCollision && isBottomCollision);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const image = new Image();
        image.src = idle.src;
        ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    }
}

class Platform {
    position: { x: number; y: number };
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class MovingPlatform extends Platform {
    speed: { x: number, y: number };

    constructor(x: number, y: number, width: number, height: number, speed: { x: number, y: number }) {
        super(x, y, width, height);
        this.speed = speed;
    }

    update(canvasWidth: number, canvasHeight: number): void {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if (this.position.x < 0 || this.position.x + this.width > canvasWidth) {
            this.speed.x -= this.speed.x * 2;
        }

        if (this.position.y < 0 || this.position.y + this.height > canvasHeight) {
            this.speed.y *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class JumpingPlatform extends Platform {
    jumpHeight: number;

    constructor(x: number, y: number, width: number, height: number, jumpHeight: number) {
        super(x, y, width, height);
        this.jumpHeight = jumpHeight;
    }

    update(player: Player): void {
        if (player.checkCollision(this)) {
            player.jump();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Obstacle {
    position: { x: number, y: number };
    speed: number;
    width: number;
    height: number;

    constructor(x: number, y: number, speed: number, width: number, height: number) {
        this.position = { x, y };
        this.speed = speed;
        this.width = width;
        this.height = height;
    }

    update() {
        this.position.x -= this.speed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const DinoChicken = () => {
    const [isClient, setIsClient] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [player] = useState(new Player(100, 400, 50, 50));
    const [obstacles] = useState([new Obstacle(300, 300, 5, 50, 50), new Obstacle(400, 150, 2, 50, 50)]);
    const [platforms] = useState([
        new JumpingPlatform(300, 300, 150, 20, 10),
        new Platform(150, 600, 200, 20),
        new MovingPlatform(500, 100, 100, 20, { x: 5, y: 0 }),
        new Platform(100, 500, 200, 20),
    ]);

    const updateGame = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            const renderGameOverScreen = (ctx: CanvasRenderingContext2D) => {
                ctx.fillStyle = "rgba(114, 104, 104, 0.8)"; 
                ctx.fillRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
            
                ctx.fillStyle = "white";
                ctx.font = "48px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", (canvasRef.current?.width ?? 0) / 2, (canvasRef.current?.height ?? 0) / 2 - 20);
                ctx.font = "24px Arial";
                ctx.fillText("Press R to Restart", (canvasRef.current?.width ?? 0) / 2, (canvasRef.current?.height ?? 0) / 2 + 30);
            };
    
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                if (!player.gameOver) {
                    player.update(platforms, obstacles);
                    player.draw(ctx);
    
                    platforms.forEach((platform) => {
                        platform.draw(ctx);
                        if (platform instanceof MovingPlatform) {   
                            platform.update(canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);
                        }   
                        else if (platform instanceof JumpingPlatform) {
                            platform.update(player);
                        }
                });
    
                obstacles.forEach((obstacle) => {
                    obstacle.update();
                    obstacle.draw(ctx);
                });
                }
                else {
                    renderGameOverScreen(ctx);
                }
    
                
            }
        }
    
        requestAnimationFrame(updateGame);
    };

    useEffect(() => {
        if (isClient && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
            updateGame();
        }
    }, [isClient, player, platforms]);

    const restartGame = () => {
        player.gameOver = false;
        
        player.position = { x: 100, y: 400 };
        player.velocity = { x: 0, y: 0 };
        player.friction = 0;
    
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.key === "w" || event.key === "ArrowUp")) {
            player.jump();
        }
        if (event.key === "d" || event.key === "ArrowRight") {
            player.moveRight();
        }
        if (event.key === "a" || event.key === "ArrowLeft") {
            player.moveLeft();
        }
        if (event.key === "q"){
            player.dash();
        }
        if (event.key === "r" && player.gameOver) {
            restartGame();
        }
    };

    useEffect(() => {
        if (isClient) {
            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isClient, player]);

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return <canvas className='h-full w-full' ref={canvasRef}></canvas>;
};

export default DinoChicken;
