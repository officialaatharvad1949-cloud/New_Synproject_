p=console.log;
p("hello bigboyss");


p=console.log;
p("Hello Big boy");
second=4;
let index=0;
let stat=[];
let time_taken=10;
const time_left=[];
let quize_cache=null;

const API_KEY="AIzaSyAiNnwyB09ok4Z9OAHZbqEB3ltpLQD2DTM"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
// const input=document.getElementById("")
const ans_sheet=document.createElement('div');

const exp=document.getElementById("explain");// for the explaination box 
const start_btn=document.getElementById("start");
const username_btn=document.getElementById("user-name");
const last_page=document.getElementById("last_page");
const explanation_box=document.createElement("div");
explanation_box.innerText="Explanation for the answer will appear here ";
const question_tab=document.getElementById("question");
const question_container=document.getElementById("quize-question");
const login_container=document.getElementById("start-page");
const generate_ai=document.createElement("button");
generate_ai.innerText="Generate Ai";
login_container.appendChild(generate_ai);
const streak_box=document.createElement("div");
streak_box.innerText="Streak";

const selection=document.createElement("select");
/// option for the difficulty level 
const options=["Easy","Medium","Hard","Insane"];
 
options.forEach(opt =>{
    const option=document.createElement("option");
    option.value=opt;
    option.innerText=opt;
    selection.appendChild(option);
})

login_container.appendChild(selection);
selection.addEventListener("change", () => {
    console.log("Selected:", selection.value);
});

const ques_no=document.createElement("select");

const no_ques=[5,10,15,20];

no_ques.forEach(opt=>{
    const option=document.createElement("option");
    option.value=opt;
    option.innerText=opt;
    ques_no.appendChild(option);

})

const number_ques=document.createElement("div");
number_ques.appendChild(ques_no);
login_container.appendChild(number_ques);
const topic=document.createElement("div");
const topic_input=document.createElement("input");
topic_input.placeholder="General Knowlege";
topic.appendChild(topic_input);
login_container.appendChild(topic);


const timeDisplay=document.getElementById("time_container");
const next_btn=document.getElementById("next-btn");
let streak=0;
let corrent_ans=0;
let data_promise=null;

// timeDisplay.innerText="30 sec";

if(!start_btn){
    p("memory is null");
}

generate_ai.addEventListener('click',()=>{
    async function load_data(){
    if(quize_cache)return quize_cache;
    quize_cache=await quizebot(ques_no.value,topic_input.value,selection.value);
    localStorage.setItem('store_data',JSON.stringify(quize_cache));
    return quize_cache;
}
data_promise=load_data();

if(load_data){
    p("done");
}
})

// async function load_data(){
//     if(quize_cache)return quize_cache;
//     quize_cache=await quizebot(ques_no.value,topic_input.value,selection.value);
//     return quize_cache;

// }
// const data_promise=load_data();


start_btn.addEventListener("click",async()=>{
    p("start-btn is pressed");
    p(ques_no.value);
    p(selection.value);
    p(topic_input.value);

    const  quize2_data= await data_promise;
    // p(quiz_data[0].question);
    
    // quizebot();
    p(username_btn.innerText);
    streak_box.innerText=streak;
    question_tab.innerText=quize2_data[index].question;
    question_container.style.display="block";
    login_container.style.display="none";

      for(i=0;i<4;i++){
        const bttn=document.createElement("button");
        bttn.id="button"+i;
        bttn.value=i;
        bttn.innerText=quize2_data[index].options[i];
        question_container.appendChild(bttn);
        

    }

point_ans();

timer();
});
// function button_disable(){
//     for(let i=0;i<quize_cache.size;i++){
//         const buton=document.getElementById("button"+i);
//         buton.disabled="true";
//     }

// }
// function button_enable(){
//     for(let i=0;i<quize_cache.length;i++){
//         const buton=document.getElementById("button"+i);
//         buton.disabled="false";
//     }

// }
let time=30;
let Timeleft;
let timestamp=-1;
function timer(){
    time=30;
    timestamp=-1;
    
     Timeleft=setInterval(()=>
    {
        timeDisplay.innerText=time+" sec";
        time--;
        if(time<0){
            clearInterval(Timeleft);
           
            exp.innerText=quize_cache[index].explanation;
            time_left[index]=30;
        }
        
    },1000);
}
function stop_timer(){
    timestamp=0;
    clearInterval(Timeleft);
    timestamp=29-time;
    p(timestamp)
    time_left[index]=timestamp;
}
next_btn.addEventListener('click',()=>{
    // button_enable();
    next_question();
})
 function next_question(){
    const quize1_data= quize_cache;
    if(index==ques_no.value-1){
        p("End of quize");
        clearInterval(Timeleft);
        answer_sheet();
        last_explain();
    }
    else{
        index++;
        question_tab.innerText=quize1_data[index].question;

    for(i=0;i<4;i++){
        const btn=document.getElementById("button"+i);
        btn.innerText=quize1_data[index].options[i];
    }
    }
    exp.innerText="";
    timer();
}

 function point_ans(){
    
    for(let i=0;i<4;i++){
    const btn=document.getElementById("button"+i);
    if(!btn){
        p(null);
    }
    btn.addEventListener('click',()=>{
        stop_timer();
        p(i);
        // button_disable();
        check_answer(btn.value);

    })

}
}
async function check_answer(selected_ans){
   
    if(selected_ans==quize_cache[index].correct){
        corrent_ans++;
        p("true");
        stat[index]=true;
        streak++;
        exp.innerText="True .\n"+quize_cache[index].explanation;
    }else{
        p("false");
        stat[index]=false;
        streak=0;
        exp.innerText="False .\n"+quize_cache[index].explanation;
    }  
}
// dummy question 
const Quize_library={
    structure:[
        {
           "question":"what is 2+2?",
           "options_list":[1,2,4,5],
           "Answer":"2"
        },
        {
            "question":"who is tanmay",
            "options_list":["superman","batman","ironman","spiderman"],
            "Answer":"2"
        }
    ]
    
};

async function quizebot(que_no,Topic,difficulty){
try {
    const prompt = `Generate ${que_no} multiple choice questions on the topic: ${Topic}.

Difficulty level: ${difficulty}.

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT include markdown or backticks.
- Do NOT include any explanation outside JSON.
- Each question must have:
  - question (string)
  - options (array of exactly 4 strings)
  - correct (index 0-3)
  - explanation (string)

Output format:
[
 {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "string"
  }
]`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });


    const data = await response.json();


    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // console.log("AI Response:", text);
    const usable_data=JSON.parse(text);// this convert all the info in the usable format for our convenient 
    // p(usable_data);
    // p(usable_data[0].question);
    // p(usable_data[0].options);
    return usable_data;
    // p(text.structure[0].question)

  } catch (error) {
    console.error("API Error:", error);
  }
}

// last_page.style.display="block";
function answer_sheet(){
    // const ans_sheet=document.createElement('div');
    question_container.style.display="none";
    last_page.style.display="block";
    const correct_sheet=document.createElement('div');
    correct_sheet.innerText=corrent_ans+" is correct out of "+ques_no.value;
    ans_sheet.appendChild(correct_sheet);
    for(let i=0;i<ques_no.value;i++){
        const ques=document.createElement("div");
        const btn=document.createElement("button");

        btn.innerText="Explanation";
        btn.id="exp_btn"+i;
        ques.append(i+1 + ".");
        ques.append(" "+quize_cache[i].question+" "+time_left[i]+" "+stat[i]);
        ques.appendChild(btn);
        ans_sheet.appendChild(ques);
    }
    
    last_page.appendChild(ans_sheet);
}
function last_explain(){
    for(let i=0;i<ques_no.value;i++){
        
        const button=document.getElementById("exp_btn"+i);
        
       
        button.addEventListener("click",()=>{
            
           explanation_box.innerText="";
            explanation_box.innerText=quize_cache[i].explanation;

            ans_sheet.appendChild(explanation_box);
                    
        });
    
}

}


// Generate 3 multiple choice questions on the topic: "Java".

// Difficulty level: medium.

// STRICT RULES:
// - Return ONLY valid JSON.
// - Do NOT include markdown or backticks.
// - Do NOT include any explanation outside JSON.
// - Each question must have:
//   - question (string)
//   - options (array of exactly 4 strings)
//   - correct (index 0-3)
//   - explanation (string)

// Output format:
// [
//   {
//     "question": "string",
//     "options": ["A", "B", "C", "D"],
//     "correct": 0,
//     "explanation": "string"
//   }
// ]