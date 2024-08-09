import { useEffect} from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Possession from '../../../patrimoine-economique/models/possessions/Possession';
import Flux from '../../../patrimoine-economique/models/possessions/Flux';

function App() {
  const [data, setData] = useState()
  const [possessions, setPossessions] = useState([])
  const [datePicker, setDatePicker] = useState()
  const [patrimonyValue, setPatrimonyValue] = useState(0)
  const [arrayResult, setArrayResult] = useState([])

   //const possession1 = new Possession("NOnie", "jsp", 123, new Date(2024, 0, 23), new Date(2025, 7, 12), 13);
 //const possession2 = new Possession("Annah", "jgfy", 6254, new Date(2024, 1, 23), new Date(2025, 7, 16), 14);
 //const possession3 = new Possession("NOnie", "sdflk", 1254, new Date(2024, 0, 23), new Date(2025, 7, 12), 13);
 //const possession4 = new Possession("Annah", "dfdg", 62340, new Date(2024, 1, 23), new Date(2025, 7, 16), 14);

 //const possessions = [possession1, possession2,possession3,possession4];

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data)
        if (data && data[1] && Array.isArray(data[1].data.possessions)) {
          instancing(data[1].data.possessions)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function instancing(possessionsData) {
    const newPossessions = possessionsData.map((oneData) => {
      if(oneData.libelle == "Alternance" ||oneData.libelle == "Survie"){
        return new Flux(oneData.possesseur.nom, oneData.libelle,oneData.valeur, new Date(oneData.dateDebut),oneData.dateFin,
          oneData.tauxAmortissement || "0",oneData.jour,oneData.valeurConstante
      )
      }
      return new Possession(
        oneData.possesseur.nom,oneData.libelle,oneData.valeur,new Date(oneData.dateDebut),oneData.dateFin ,oneData.tauxAmortissement || 0
      )
    })
    setPossessions(newPossessions)
  }

  function getDatePicker(e) {
    setDatePicker(e.target.value)
    console.log(e.target.value)
  }

  function getNewValue() {
    const date = new Date(datePicker)

    const values = possessions.map((possession) => 
      possession.getValeurApresAmortissement(date)
    )

    const results = values.reduce((previousValue, currentValue) => 
      previousValue + currentValue
    )

    console.log(results)
    setPatrimonyValue(results)
    console.log("succeed")
  }

  useEffect(() => {
    if (possessions.length > 0) {
      getActualValue()
    }
  }, [possessions])

  function getActualValue() {
    const today = new Date()
    
    const results = possessions.map(possession => {
      if(possession.libelle === "Alternance" || possession.libelle === "Survie"){
        console.log(possession.valeurConstante)
        const month = today.getMonth()- possession.dateDebut.getMonth()
        return (possession.valeur + possession.valeurConstante*month)
      }else{
        return possession.getValeurApresAmortissement(today)
      }
      
    }
    )
    setArrayResult(results)
  }

  function ShowList(props) {
    const { possessions, arrayResult } = props

    return (
      <tbody>
        {possessions.map((possession, i) => (
        <tr key={i}>
            <td>{possession.libelle}</td>
            <td>{possession.valeur}</td>
            <td>{possession.dateDebut.toDateString()}</td>
            <td>{possession.dateFin ? possession.dateFin.toDateString() : 'inconnue'}</td>
            <td>{possession.tauxAmortissement}</td>
            <td>{arrayResult[i]}</td>
        </tr>
        ))}
      </tbody>
    )
  }




  return (
    <>
      <h1>Patrimoine HEI</h1>
      <div className="inputContainer">
        <div className="input-group mb-3 oneInput">
          <span className="input-group-text oneSpan" id="inputGroup-sizing-default">Date Picker</span>
          <input 
            type="date" 
            className="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-default" 
            onChange={getDatePicker}
          />
        </div>
        <button 
          type="button" 
          className="btn btn-primary bouton" 
          onClick={getNewValue}>
          calculer
        </button>
        <div className='resultats'>
          LA VALEUR DU PATRIMOINE : {patrimonyValue} Ariary
        </div>
      </div>
      <table className="table table-dark table-striped tableau">
        <thead>
          <tr>
            <th scope="col">Libelle</th>
            <th scope="col">Valeur initiale</th>
            <th scope="col">Date de début</th>
            <th scope="col">Date de fin</th>
            <th scope="col">Amortissement</th>
            <th scope="col">Valeur actuelle</th>
          </tr>
        </thead>
        <ShowList possessions={possessions} arrayResult={arrayResult} />
      </table>
    </>
  )
}

export default App;
