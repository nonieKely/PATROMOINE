import { useEffect} from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Possession from '../../../patrimoine-economique/models/possessions/Possession';

function App() {
  const [data, setData] = useState();
  const [possessions, setPossessions] = useState([]);
  const [datePicker, setDatePicker] = useState();
  const [patrimonyValue, setPatrimonyValue] = useState(0);
  const [arrayResult, setArrayResult] = useState([]);

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        if (data && data[1] && Array.isArray(data[1].data.possessions)) {
          instancing(data[1].data.possessions);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function instancing(possessionsData) {
    const newPossessions = possessionsData.map((oneData) => {
      return new Possession(
        oneData.possesseur.nom,oneData.libelle,oneData.valeur,new Date(oneData.dateDebut),oneData.dateFin ,oneData.tauxAmortissement || 0,
        oneData.jour,oneData.valeurConstante || 0
      );
    });
    setPossessions(newPossessions);
  }

  function getDatePicker(e) {
    setDatePicker(e.target.value);
    console.log(e.target.value);
  }

  function getNewValue() {
    const date = new Date(datePicker);

    const values = possessions.map((possession) => 
      possession.getValeurApresAmortissement(date)
    );

    const results = values.reduce((previousValue, currentValue) => 
      previousValue + currentValue
    );

    console.log(results);
    setPatrimonyValue(results);
    console.log("succeed");
  }

  useEffect(() => {
    if (possessions.length > 0) {
      getActualValue();
    }
  }, [possessions]);

  function getActualValue() {
    const today = new Date();
    const results = possessions.map(possession => 
      possession.getValeurApresAmortissement(today)
    );
    setArrayResult(results);
  }

  function ShowList(props) {
    const { possessions, arrayResult } = props;

    return (
      <tbody>
        {possessions.map((possession, index) => (
        <tr key={index}>
            <td>{possession.libelle}</td>
            <td>{possession.valeur}</td>
            <td>{possession.dateDebut.toDateString()}</td>
            <td>{possession.dateFin ? possession.dateFin.toDateString() : 'inconnue'}</td>
            <td>{possession.tauxAmortissement}</td>
            <td>{arrayResult[index]}</td>
        </tr>
        ))}
      </tbody>
    );
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
  );
}

export default App;
