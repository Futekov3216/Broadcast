<template>
  <div id="skeleton">
    <div class="wrapper">
        <sui-input v-model="Username" placeholder="Username" />
        <sui-container class="Header">
           <p>{{connectMsg}}</p>  
           <sui-button primary @click="connect">CONNECT</sui-button>
        </sui-container>
        <sui-input v-model="Recipient" placeholder="Recipient" />
        <textarea v-model="Msg" rows="15" cols="100">TOKA</textarea>
        <sui-button primary @click="sendMsg">SEND MSG</sui-button>
         <sui-button secondary @click="broadcastMsg">BROADCAST MSG</sui-button>
        <sui-container class="Header">
        MESSAGES
        </sui-container>
        <sui-container class="chatContainer">
             <p v-for="(msg, index) in allMsgs" :key="index">{{index + '/' + msg.username + ' : ' + msg.msg}}</p>
            
        </sui-container>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client';
const host = "localhost" // must be the real ip to work on phones otherwise localhost does the

export default {
    data(){
        return{
            socket : io(`http://${host}:3001`),
            Username:'',
            Recipient:'',
            Msg:'',
            allMsgs:[],
            connectMsg:'ENTER USERNAME AND  CLICK THE BUTTON CONNECT',
            text:'',
            info:{
                username: this.Username,
               reciepient: this.Recipient,
               msg: this.Msg
            }

        }
    },
    methods:{
       sendMsg (){
           let check = true
           let click = 0;
           this.info = {
               username: this.Username,
               reciepient: this.Recipient,
               msg: this.Msg
           }
            this.socket.emit('private-message', this.info);           
        },
        async connect(){
            this.connectMsg = "CONNECTED"
           await this.socket.emit('add-user', {"username" : this.Username})
        },
        broadcastMsg(){
  
            this.socket.emit('broadcast', 
            {  username: this.Username,
               reciepient: this.Recipient,
               msg:'THIS IS A BROADCAST MSG :' + this.Msg
            }
            )
 
        }   
    },
    mounted(){
           this.socket.on('add-message', async data => {
                    await this.allMsgs.push(data)

            })
            this.socket.on('broadcast', async data => {
                    await this.allMsgs.push(data)

            })
    }
} 

</script>
<style lang="scss" scoped>

.wrapper{
    display: flex;
    flex-direction: column;
    width: 30%;
    margin: 1% auto;
    justify-content: space-between;
}
.Header{
    text-align: center;
}
.chatContainer{
    border: 1px solid white;
     white-space: pre-line; 
     
}

.chatContainer pre{
     white-space: pre-line;
}
.wrapper > div > input {
    padding-top: 1%!important;
}

</style>