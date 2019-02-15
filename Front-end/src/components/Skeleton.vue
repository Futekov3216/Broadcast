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
        <sui-container class="Header">
        CHAT
        </sui-container>
        <sui-container class="chatContainer">
             <p v-for="(msg, index) in allMsgs" :key="index">{{msg.username + ' : ' + msg.msg}}</p>
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
            connectMsg:'ENTER USERNAME AND  CLICK THE BUTTON CONNECT'

        }
    },
    methods:{
       async sendMsg (){
           this.allMsgs = []
           let info = {
               username: this.Username,
               reciepient: this.Recipient,
               msg: this.Msg
           }
           console.log(info)
           console.log(this.allMsgs)
            await this.socket.emit('private-message', info);
            await this.socket.on('add-message', data => {
                console.log(data)
                // this.allMsgs = data
                this.allMsgs.push(data)
                // console.log(this.allMsgs)
                })
        },
        async connect(){
             this.connectMsg = "CONNECTED"
           await this.socket.emit('add-user', {"username" : this.Username})
           await this.socket.on('add-user', username => {
            console.log(username)
            // this.allMsgs = sendMsg
        })
            // await this.socket.emit('sendMsg', '');
            // await this.socket.on('sendMsg', sendMsg => {
            //     console.log(sendMsg)
            //     this.allMsgs = sendMsg
            //     })
        }   
    }

    //     this.socket.on('sendMsg', sendMsg => {
    //         console.log(sendMsg)
    //         this.allMsgs = sendMsg
    //     })
    // }
    
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
}
.wrapper > div > input {
    padding-top: 1%!important;
}

</style>