export default class MessageDTO {
    constructor(message) {
        this.timestamp = (new Date(message.timestamp)).toLocaleString();
        this.email = message.email;
        if (message.type === 'system') { this.type = 'Customer Service'; }
        else { this.type = 'User'; }
        this.body = message.body;
    }
}