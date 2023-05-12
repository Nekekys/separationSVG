import './App.css';
import {parse} from 'svg-parser'

function App() {
    // читаем файлы
    const fileChange = (e) =>{
        let svgText = e.target.files[0]
        let reader = new FileReader();
        let result;
        let svg = document.getElementById('old')
        svg.setAttribute("src", URL.createObjectURL(e.target.files[0]))
        // console.log( URL.createObjectURL(e.target.files[0]))

        reader.onload = function (e) {
            result = e.target.result;
            convert(result)
        }

        reader.readAsText(svgText);
    }

    // основная функция
    const convert = (svgText) =>{
        const parsed = parse(svgText)
        const constructor = () => {
            const gArray = []
            const svgNS = parsed.children[0].properties.xmlns
            const iconSvg = document.createElementNS(svgNS, 'svg');
            for (let key in parsed.children[0].properties) {
                if (key !== 'xmlns') iconSvg.setAttribute(key, parsed.children[0].properties[key]);
            }
            const children = parsed.children[0].children
            for (let i = 0; i < children.length; i++) {
                if (children[i].tagName === 'g') gArray.push(buildTreeByRBFS(children[i],svgNS))
                else iconSvg.appendChild(buildTreeByRBFS(children[i],svgNS))
            }

            const finallySVGArray = []
            gArray.forEach( tagG => {
                let newSVG = iconSvg.cloneNode(true)
                newSVG.appendChild(tagG)
                finallySVGArray.push(newSVG)
            })

            return finallySVGArray
        }


        const arr = constructor()
        let div = document.getElementById('mount')
        arr.forEach(elem => {
            div.appendChild(elem)
        })

    }


    // обратный обход дерева в ширину
    function buildTreeByRBFS(tree, svgNS) {

        let nuwTree =  document.createElementNS(svgNS, tree.tagName)

        for (let key in tree.properties) {
            nuwTree.setAttribute(key, tree.properties[key]);
        }

        if (!tree.children) return nuwTree

        for (let i = 0; i < tree.children.length; i++){
            if ( tree.children[i].type === 'text' ) nuwTree.innerHTML = tree.children[i].value
            else nuwTree.appendChild( buildTreeByRBFS(tree.children[i], svgNS))
        }
        return nuwTree
    }



  return (
    <div className="App">
        <input style={{ marginBottom: '15px' }} onChange={fileChange} type="file"/>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <div>
                <div id="mount"></div>
                <p>Разделеные</p>
            </div>
            <div  >
                <img id="old"/>
                <p>Оригинал</p>
            </div>
        </div>
    </div>
  );
}

export default App;
