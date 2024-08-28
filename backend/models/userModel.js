const mongoose= require("mongoose");
const bcrypt= require("bcryptjs"); 
const userSchema= mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required: true},
    pic:{type: String, default:"https://www.google.com/imgres?q=default%20avatar%20profile%20icon&imgurl=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F05%2F49%2F98%2F39%2F360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Ddefault%2Bavatar&docid=poxYYtr45wzCGM&tbnid=hy8oTwjvtmAQ7M&vet=12ahUKEwiOkt3n4ZKIAxX_xTgGHZQ2LhkQM3oECFUQAA..i&w=360&h=360&hcb=2&ved=2ahUKEwiOkt3n4ZKIAxX_xTgGHZQ2LhkQM3oECFUQAA"},    
},
{timestamps:true},
);
userSchema.methods.matchPassword= async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save', async function(next) {
    if(!this.isModified){
        next();
    }
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
});
const User= mongoose.model("User", userSchema);
module.exports=User;