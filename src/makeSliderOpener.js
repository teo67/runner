export default (button1, slider1, minSize, maxSize, sliderSpeed = 5) => {
    button1.onpress = () => {
        if(slider1.x.size > minSize) {
            slider1.x.velocity = sliderSpeed;
            slider1.x.expansionSpeed = -sliderSpeed;
        }
    }
    
    button1.onrelease = () => {
        if(slider1.x.size < maxSize) {
            slider1.x.velocity = -sliderSpeed;
            slider1.x.expansionSpeed = sliderSpeed;
        }
    }
    
    slider1.xreceivesMomentum = false;
    slider1.yreceivesMomentum = false;
    slider1.updates = true;
    slider1.turnOnExpansion();
    
    slider1.update = () => {
        if(slider1.x.size < minSize && slider1.x.velocity > 0) {
            slider1.x.velocity = 0;
            slider1.x.expansionSpeed = 0;
        } else if(slider1.x.size > maxSize && slider1.x.velocity < 0) {
            slider1.x.velocity = 0;
            slider1.x.expansionSpeed = 0;
        }
    }
}