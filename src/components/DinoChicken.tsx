'use client';
import React, { useEffect, useRef, useState } from 'react';

class Player {
    position: { x: number, y: number };
    velocity: number;
    jumpHeight: number;
    gravity: number;
    width: number;
    height: number;
    isGrounded: boolean;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.velocity = 0;
        this.jumpHeight = -10;
        this.gravity = 1;
        this.width = width;
        this.height = height;
        this.isGrounded = false;
    }

    jump() {
        if (this.isGrounded) {  
            this.velocity = this.jumpHeight;
            this.isGrounded = false;
        }
    }

    moveLeft() {
        this.position.x -= 5;
    }

    moveRight() {
        this.position.x += 5;
    }

    update(platforms: Platform[]): void {
        this.isGrounded = false;

        platforms.forEach((platform) => {
            if (this.checkCollision(platform)) {
                if (this.velocity > 0) {
                    this.position.y = platform.position.y - this.height;
                    this.isGrounded = true;
                }
            }
        });
       
        if (!this.isGrounded) {
            this.velocity += this.gravity;
            this.position.y += this.velocity;
        } 
        if (this.position.y > window.innerHeight - this.height) {
            this.position.y = window.innerHeight - this.height;
            this.velocity = 0; 
            this.isGrounded = true;
        }
    }

    checkCollision(platform: Platform): boolean {
        const isHorizontalCollision =
            this.position.x + this.width > platform.position.x &&
            this.position.x < platform.position.x + platform.width;

        const isVerticalCollision =
            this.position.y + this.height <= platform.position.y &&
            this.position.y + this.height + this.velocity >= platform.position.y;

        return isHorizontalCollision && isVerticalCollision;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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

    isPlayerOnPlatform(player: Player): boolean {
        return (
            player.position.y + player.height === this.position.y &&
            player.position.x + player.width > this.position.x &&
            player.position.x < this.position.x + this.width
        );
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
            this.speed.x *= -1;
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
        if (player.position.x + player.width > this.position.x && player.position.x < this.position.x + this.width) {
            if (player.position.y + player.height === this.position.y) {
                player.velocity = this.jumpHeight;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Obstacle {
    position = { x: 0, y: 0 };
    speed = 5;
    width = 20;
    height = 20;

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
    const [platforms] = useState([
        new JumpingPlatform(100, 500, 150, 20, 10),
        new Platform(300, 300, 200, 20),
        new MovingPlatform(500, 100, 100, 20, { x: 5, y: 5 })
    ]);

    const updateGame = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                player.update(platforms);
                player.draw(ctx);

                platforms.forEach((platform) => {
                    platform.draw(ctx);
                });
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

    return <canvas ref={canvasRef}></canvas>;
};

export default DinoChicken;
