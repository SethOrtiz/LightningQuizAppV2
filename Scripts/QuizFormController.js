({   
    doInit : function(component, event, helper) {
        document.addEventListener('contextmenu', event => event.preventDefault());
    },
    startTimer: function(component, event, helper) {
        let timer = component.find("timer");
        timer.countdown();
    },
    handleQuestionsPerScreenChange : function(component, event, helper) {
        let qps = parseInt(event.getParam("value"));    
        let questions = component.get("v.questions");
        let end = component.get("v.end");        
        let start = component.get("v.start");        
        let pageSize = component.get("v.pageSize"); 
        
        start = 0;
        end = qps;
        
        for(let i = 0; i < questions.length; i++)           
        {      
            if(i < start || i > end - 1)  { 
                questions[i].display = 'none';                       
            } else {
                questions[i].display = 'block';
            }            
        }
         
        component.set("v.start",start);        
        component.set("v.end",end); 
        component.set("v.pageSize", qps);
        component.set("v.questions", questions);
    },
    handleAnswerSelected : function(component, event, helper) {
        let answerSelected = event.getParam("answerSelected");
        let questions = component.get("v.questions");
        
        questions.forEach(attachAnswer);
        function attachAnswer(q) {
            if (q.Id === answerSelected.id){
                q.answerSelected = answerSelected.answer;
                if(answerSelected.answer.trim() === q.Correct_Answer__c.trim()){
                    q.correct = true;
                } else {
                    q.correct = false;
                }
            }
        }
        
        component.set("v.results", questions);
    },
       
    next : function(component, event, helper) {        
        let questions = component.get("v.questions");        
        let end = component.get("v.end");        
        let start = component.get("v.start");        
        let pageSize = component.get("v.pageSize");             
    
                
        start = start + pageSize;        
        end = end + pageSize;   
        
        for(let i = 0; i < questions.length; i++)           
        {      
            if(i < start || i > end - 1)  { 
                  questions[i].display = 'none';                       
            } else {
                 questions[i].display = 'block';
            }            
        }
        
        component.set("v.start",start);        
        component.set("v.end",end);     
        component.set("v.questions", questions);       
    }, 
    
    previous : function(component, event, helper) {    
        let questions = component.get("v.questions");        
        let end = component.get("v.end");        
        let start = component.get("v.start");        
        let pageSize = component.get("v.pageSize");             
        
        start = start - pageSize;        
        end = end - pageSize;   
        
        for(let i = 0; i < questions.length; i++) {      
            if(i < start || i > end - 1) { 
                questions[i].display = 'none';                       
            } else {
                questions[i].display = 'block';
            }            
        }
        
        component.set("v.start", start);        
        component.set("v.end", end);     
        component.set("v.questions", questions);   
    },
    
    handleQuizSubmit : function(component, event, helper) {
        const qsc = component.getEvent("qsc");
        const results = component.get("v.results");
        const questions = component.get("v.questions");
        let submissionValid = true;
        if (results.length == 0){
            submissionValid = false;
        }
        results.forEach(varifyNotNull);
        function varifyNotNull(result) {
            if (result.answerSelected === undefined){
                submissionValid = false;
            }
        }
        
        if(submissionValid === true){
            component.set("v.stopTimer", "true");
            qsc.setParams({"stage": "RESULTS", "results": results});
            qsc.fire();
            component.set("v.errorMessage", false);
        } else {
            questions.forEach(markRequired);
            function markRequired(question) {
                if (question.answerSelected === undefined){
                    question.required = true;
                }
            }
            component.set("v.questions", questions);
            component.set("v.errorMessage", true);
        }
    }
})