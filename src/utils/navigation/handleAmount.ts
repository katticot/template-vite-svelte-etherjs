
export class Amount {
    amount: number=2;
     add = () => {
        if (this.amount < 5) this.amount++;
    };
    minus = () => {
        if (this.amount > 1)  this.amount--;
    };


}