window.onload = function() {
    let chat=document.getElementById("chats");
    let friendname=prompt("Enter your your name");
    let Container=document.querySelector(".Container")
    const input=document.querySelector('#Message')
    document.getElementById("name2").innerText=friendname
    
    let roomID=''
    let room=window.location.pathname;
    
    const sock2=io("http://localhost:8080/letgo");
    sock2.on('chats',Message); 
    sock2.on('newUser',Message2); 
    sock2.on('connectionStatus',Message3); 
    sock2.on('typingFun',typing); 
    sock2.on('StopTypingFun',StopTyping); 
    sock2.on('updateName',Message4); 
    sock2.on('updateMessage',Message6); 
    
    
    
    function generateRoomName(roomName){
        roomID="ID :"+roomName;
        room=roomName;
        document.querySelector(".chatsID").innerHTML=roomID
        sock2.emit("room",{roomName,friendname})
    }
    
    generateRoomName(room);
    
    
    function play(){
       let myAudio=new Audio('notification.wav');
        myAudio.play();
    }
    
    
    function  onFormSubmitted(e){
        e.preventDefault();
        const text=input.value;
        input.value=""
        sock2.emit("roomChats",{friendname,message:text,room})
        Message5(text)
    }
    

    function Message(value){

        if(document.getElementById("id1")){
            document.getElementById("id1").remove();
        }
        let conatiner=document.createElement("div")
        let conatinerContent=document.createElement("div")
        conatiner.className="chatsConatiner1"
        conatinerContent.className="text1"
        conatinerContent.innerText=value.message
        conatiner.appendChild(conatinerContent);
        chat.appendChild(conatiner);
        play()

        shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
        if (!shouldScroll) {
            scrollToBottom();
        }
    }
    
    
    
    
    function Message2(value){
        play()
        document.querySelector(".chatsConnection").innerHTML="connected"
        sock2.emit("updateName",{room,friendname})

       // document.getElementById("name1").innerHTML=value.friendname
    }

    function Message3(value){
        document.querySelector(".chatsConnection").innerHTML=value
        document.getElementById("name1").innerHTML=""
    }

    function Message4(value){
        document.getElementById("name1").innerHTML=value.friendname   
    }


    function Message5(value){
        if(document.getElementById("id1")){
            document.getElementById("id1").remove();
        }
        let conatiner=document.createElement("div")
        let conatinerContent=document.createElement("div")
        conatiner.className="chatsConatiner2"
        conatinerContent.className="text2"
        conatinerContent.innerText=value
        conatiner.appendChild(conatinerContent);
        chat.appendChild(conatiner);
        shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
        if (!shouldScroll) {
            scrollToBottom();
          }
    }
    
    function Message6(value){
        
        for(let i=0; i<value.length;i++){
            if(value[i].name==friendname){
                if(document.getElementById("id1")){
                    document.getElementById("id1").remove();
                }
                let conatiner=document.createElement("div")
                let conatinerContent=document.createElement("div")
                conatiner.className="chatsConatiner2"
                conatinerContent.className="text2"
                conatinerContent.innerText=value[i].message
                conatiner.appendChild(conatinerContent);
                chat.appendChild(conatiner);
                shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
                if (!shouldScroll) {
                    scrollToBottom();
                  }
               }
               else{
                    if(document.getElementById("id1")){
                        document.getElementById("id1").remove();
                    }
                    let conatiner=document.createElement("div")
                    let conatinerContent=document.createElement("div")
                    conatiner.className="chatsConatiner1"
                    conatinerContent.className="text1"
                    conatinerContent.innerText=value[i].message
                    conatiner.appendChild(conatinerContent);
                    chat.appendChild(conatiner);
                    play()
        
                    shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
                    if (!shouldScroll) {
                        scrollToBottom();
                    }
               }
        }
    }
    function typing(){
        
        
        let chatDiv=document.createElement("div")
        chatDiv.id="id1"
        if(document.getElementById("id1")){
           return
        }
        else{
            chatDiv.innerText="Typing...."
            chat.appendChild(chatDiv)
            shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
        if (!shouldScroll) {
            scrollToBottom();
        }
        }
    
    }
    function StopTyping(){

            setTimeout(()=>{ 
                if(document.getElementById("id1")){
                    document.getElementById("id1").remove();
                    shouldScroll = Container.scrollTop + Container.clientHeight === Container.scrollHeight;
                    if (!shouldScroll) {
                        scrollToBottom();
                    }
                }   
            },5000)
    
            
    }
    input.addEventListener('keyup',()=>{ sock2.emit("StopTyping",room)});
    input.addEventListener('keydown', ()=>{ sock2.emit("Typing",room)});
    document.getElementById('form').addEventListener('submit',onFormSubmitted);
    
    // for scrolling down to the last message
    function scrollToBottom() {
        Container.scrollTop = Container.scrollHeight;
    }
      

}