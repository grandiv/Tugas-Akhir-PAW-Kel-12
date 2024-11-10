import Image from "next/image"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

export default function HistoryCard({
    date = "01-01-1111", 
    productList = [{ imageUrl: "/sayur/8.png", name: "Buncis 400gr", price: 10900 },
    { imageUrl: "/sayur/9.png", name: "Wortel 400gr", price: 10000, quantity:"2" }],
    state = "Cancel"  
}){
    function StatusCard({state}){
        if(state == "On Process")
            return(
                <div className='p-2 rounded-[3px] bg-yellow-600 text-yellow-600 bg-opacity-25'>
                    {state}
                </div>
            )
        else if(state == "Done")
            return(
                <div className='p-2 rounded-[3px] bg-green-500 text-green-500 bg-opacity-25'>
                    {state}
                </div>
        )
        else if(state == "Cancel")
            return(
                <div className='p-2 rounded-[3px] bg-red-500 text-red-500 bg-opacity-25'>
                    {state}
                </div>
        )
    }
    return (
        <Card className='p-[12px] grid grid-cols-2 gap-y-[8px] text-[#253D4E]'>
            <p className='flex items-center'>{date}</p>
            <div className='flex justify-end items-center'>
            <StatusCard state={state}/>
            </div>
            <div className='col-span-2'>
                {productList.map((product, index)=>(
                    <Card key={index} className='p-2 flex text-[#253D4E] gap-[8px]'>
                        <Image alt={product.price} src={product.imageUrl} height={1000} width={1000} className='w-24 h-24'/>
                        <div className='flex flex-col gap-[2px]'>
                            <h3 className='font-medium'>{product.name}</h3>
                            <p>Rp{product.price}</p>
                            <p>x{product.quantity}</p>
                        </div>
                    </Card>
                ))}
            </div>
            <div className='col-span-2 flex justify-end gap-[8px]'>
                {(state == "On Process")&&<Button 
                variant="custom"
                className='bg-red-500 hover:bg-red-600 transition-colors duration-100 text-white font-medium w-fit'
                >Cancel order</Button>}
                <Button 
                variant="custom"
                className='bg-green-500 hover:bg-green-600 transition-colors duration-100 text-white font-medium w-fit'
                >See Detail</Button>
            </div>
        </Card>
    )
}