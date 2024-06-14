import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number | undefined,
  price_def: number | undefined,
  ratio: number | undefined,
  timestamp: Date | undefined,
  upper_bound: number | undefined,
  lower_bound: number | undefined,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
        let priceABC: number | undefined;
        let priceDEF:  number | undefined;

        //creating an upper bound and lower bound:
        const upperBound = 1 + 0.05;
        const lowerBound = 1 - 0.05;

        let timestamp : Date | undefined;
        let timeABC : Date | undefined;
        let timeDEF : Date | undefined;

        // mapping through array and calculating the price of ABC and DEF:
     const rows = serverResponds.forEach((el: any) => {
        if(el.stock === "ABC"){
            priceABC = (el.top_ask.price + el.top_bid.price)/2;
            //creating a new date so I can convert to a numeric value
            timeABC = new Date(el.timestamp);
            }
        if(el.stock === "DEF"){
            priceDEF = (el.top_ask.price + el.top_bid.price)/2
            timeDEF = new Date (el.timestamp)
            }
        });
    // If the two variables are not undefined, then divide priceABC from priceDEF, else ratio equals undefined
    //created if statement just in case prices for either ABC or DEF are undefined.
        const ratio = (priceABC && priceDEF) ? priceABC/priceDEF: undefined;

        //Finding max timestamp between the two stocks and making that the timestamp if variables are not undefined;
        if(timeABC !== undefined && timeDEF !== undefined) {
            //using Math.max to find the max and getTime method to create numeric value of time.
            timestamp = new Date(Math.max(timeABC.getTime(), timeDEF.getTime()));
            }
        // setting trigger alert. Creating if statement just in case ratio is undefined.
        let triggerAlert: number | undefined;
            if (ratio){
                if(ratio > upperBound || ratio < lowerBound){
                    triggerAlert = ratio
                    }
            }

     return {
         price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: triggerAlert,
      };
    }
  }


//Model Answer:
// export class DataManipulator {
//   static generateRow(serverResponds: ServerRespond[]): Row {
//    const priceABC =(serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
//    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
//    const ratio = priceABC/priceDEF;
//    const upperBound = 1 + 0.05;
//    const lowerBound = 1- 0.05;
//    return{
//        price_abc: priceABC,
//        price_def: priceDEF,
//        ratio,
//        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
//        upper_bound: upperBound,
//        lower_bound: lowerBound,
//        trigger_alert: (ratio> upperBound || ratio < lowerBound ? ratio: undefined)
//        };
//   }
// }
