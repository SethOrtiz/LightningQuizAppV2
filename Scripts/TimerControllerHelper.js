({
    autoSubmit : function(component) {
        const qsc = component.getEvent("qsc");
        const results = component.get("v.results");
        const questions = component.get("v.questions");
        
        alert("You're time is up.");
        qsc.setParams({"stage": "RESULTS", "results": results});
        qsc.fire();
    }
})