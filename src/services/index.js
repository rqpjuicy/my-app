import Mock from 'mockjs';

export default class index extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export const fetchGoodsList=()=>{
    const goodsList=Mock.mock({
        "list|20":[
            {
                key:"@id()",
                name:'@cname(10,20)',
                
            }
        ]
    });
}
