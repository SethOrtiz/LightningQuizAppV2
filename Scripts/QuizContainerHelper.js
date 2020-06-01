({
    loadQuestions : function(component, event, quizId, attempt) {
        const action = component.get("c.getQuestions");
        if(quizId !== null && attempt !== null){
            action.setParams({"quizId": `${quizId}`,
                             "attempt": `${attempt}`});
            
            action.setCallback(this, function(response) {
                const state = response.getState();
                switch(state) {
                    case "SUCCESS":
                        let questions = response.getReturnValue();
                        for(let i = 0; i < questions.length; i++){
                            let questionId = `${questions[i].Id}`;
                            let opList = questions[i].Options__c.split("```");
                            let optArr = [];
                            for(let j = 0; j < opList.length; j++){
                                let formattedOpt = {"label": opList[j],"value": opList[j]};
                                optArr.push(formattedOpt);  
                            }
                            questions[i].Options__c = optArr;
                            questions[i].Id = questionId;
                            questions[i].display = 'none';
                        }
  
                        component.set("v.totalSize", questions.length);
                        component.set("v.start", 0);
                        component.set("v.end", 5);
                        component.set("v.pageSize", 5);
                        component.set("v.totalSecondsAllotted", 30);
                        let quiz = component.find("quizForm");
                        quiz.startTimer();                        
                        for (let i = 0; i < 5; i++){
                            questions[i].display = 'block';
                        }
                        component.set("v.questions", questions); 
                        component.set("v.isLoading", false);  
                        break;
                        
                    case "INCOMPLETE":
                        console.log('Incomplete');
                        alert("INCOMPLETE");
                        break;
                        
                    case "ERROR":
                        console.log(response.getError());
                        alert("ERROR" + response.getError());
                        break;
                }
            });
            $A.enqueueAction(action);
        } else {
            console.log('Quiz and Attempt are not specified');
        }
    },
    processResults : function(component, event) {
        let results = event.getParam("results");
        let topics = [];
        for(let i = 0; i < results.length; i++)  {
            let topicIndex = topics.findIndex(item => {
                if(item.name === results[i].Topic__c){
                return true;
            }
      	})
            if(topicIndex !== -1){
                let currentQuestionGrade = (results[i].correct ? 1 : 0);
                topics[topicIndex].amount++;
                let questionsInTopic = topics[topicIndex].amount;  
                topics[topicIndex].grade = topics[topicIndex].grade + currentQuestionGrade;
                
            } else {
                let topic = {
                    "name": results[i].Topic__c == undefined  ? "Other": results[i].Topic__c,
                    "grade": (results[i].correct ? 1 : 0),
                    "amount": 1,
                };
                topics.push(topic);
            } 
        }
        
        topics.forEach((topic) => {
            topic.result= Math.round(topic.grade / topic.amount * 100);
        });
        
        component.set("v.topics", topics);
    }
})