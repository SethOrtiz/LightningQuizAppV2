({
    countdown : function(component, event, helper) {
        let stopTimer = component.get("v.stopTimer");
        let totalSeconds = component.get("v.totalSecondsAllotted");
        let counter = 0;
        let intervalID = setInterval(function (){
            counter++;
            let timeLeft = totalSeconds - counter;
            
            if (counter < totalSeconds) {
                let min = (Math.floor(timeLeft / 60));
                let sec = timeLeft % 60;
                let secondsRemaining = min + ':' + sec;
                component.set("v.secondsRemaining", secondsRemaining);
            }
            
            if (stopTimer){
                clearInterval(intervalID);
            }
            
            if ((counter === totalSeconds + 1)) {
                clearInterval(intervalID);
                helper.autoSubmit(component);
            }
        }.bind(this),1000);
    }
})