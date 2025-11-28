import { _decorator, Component, Label, Node, Sprite, tween, Vec3, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ClickerController')
export class ClickerController extends Component {

    @property(Label)
    private counterLabel: Label = null!;

    @property(Sprite)
    private clickableSprite: Sprite = null!;

    @property(Node)
    private background: Node = null!;

    private clickCount: number = 0;
    private originalScale: Vec3 = new Vec3(1, 1, 1);

    start() 
    {
        this.originalScale = this.clickableSprite.node.scale.clone();
        
        this.clickableSprite.node.on(Node.EventType.TOUCH_START, this.onScreenTap, this);
        
        this.setupAdaptiveElements();
        
        this.updateUI();
    }

    private onScreenTap() 
    {
        // Увеличиваем счетчик при клике по нему
        this.clickCount++;
        this.updateUI();
        this.animateClick();
    }

    private updateUI() 
    {
        // Обновляем текст счетчика
        if (this.counterLabel) 
        {
            this.counterLabel.string = `Тапов: ${this.clickCount}`;
        }
    }

    private animateClick() 
    {
    
        tween(this.clickableSprite.node)
            .to(0.1, { scale: new Vec3(1.3, 1.3, 1) })  
            .to(0.1, { scale: this.originalScale })      
            .start();
    }

    private setupAdaptiveElements() 
    {
        
        if (this.background) 
        {
            const bgTransform = this.background.getComponent(UITransform);
            if (bgTransform) 
            {
                bgTransform.setContentSize(view.getVisibleSize());
            }
        }

        this.clickableSprite.node.setPosition(0, 0, 0);
        
        if (this.counterLabel) 
        {
            this.counterLabel.node.setPosition(0, 400, 0);
        }

        view.setResizeCallback(() => 
        {
            this.onScreenResize();
        });
    }

    private onScreenResize() 
    {
        const screenSize = view.getVisibleSize();
        const isPortrait = screenSize.height > screenSize.width;

        if (this.background) 
        {
            const bgTransform = this.background.getComponent(UITransform);
            if (bgTransform) 
            {
                bgTransform.setContentSize(screenSize);
            }
        }

        const scale = isPortrait ? 0.4 : 0.3;  
        this.clickableSprite.node.setScale(scale, scale, 1);
        this.originalScale = new Vec3(scale, scale, 1);

        // Вывод в консоль для отладки
        console.log(`Экран: ${screenSize.width}x${screenSize.height}, ${isPortrait ? 'Вертикальный' : 'Горизонтальный'}`);
    }

    onDestroy()
    {
        
        this.clickableSprite.node.off(Node.EventType.TOUCH_START, this.onScreenTap, this);
    }
}

