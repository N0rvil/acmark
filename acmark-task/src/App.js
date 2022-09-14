import React, {useState} from 'react';
import axios from 'axios';

import Record from './components/Record/Record';

import './App.css'

const App = () => {
    const [ico, setIco] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [icoErr, setIcoErr] = useState(false);
    const [companyNameErr, setCompanyNameErr] = useState(false);
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);

    const handleSubmit = (e) => { // function after submiting the form to get data
        e.preventDefault();
        const includeLetters =(string) => { // function for checking if the IČO contain only numbers
            return /^[0-9]+$/.test(string); // if string does not contain letter funcion return true
        }
        if (ico && companyName) {
            return setCompanyNameErr(true);
        }
        if (!includeLetters(ico) && ico.length > 0) {
            return setIcoErr(true);
        }
        setCompanyNameErr(false);
        setIcoErr(false);
        const data = { ico, companyName };
        axios({
            method: 'POST',
            url: `http://localhost/acmark-task_backend/getdata.php`,
            data: data,
        })
        .then(res => {
            if (res.data.length > 0) {
                setData(res.data);
                setMessage('');
            } else {
                setData([]);
                setMessage('Zadané hodnotě neodpovídá žádný výsledek');
            } 
        })
        .catch(err => console.log(err)); 
        }

        const renderItems = (listOfData) => { // fuction for rendering the companies fetched from ARES or database
            if (Array.isArray(listOfData[0]) && listOfData.length > 0) { // if user asking for company with ičo number (just one record)
                return <Record ico={listOfData[2][0]} companyName={ listOfData[3]['@attributes'].zdroj === 'DPH' ? listOfData[4][0] : listOfData[3][0]} address={listOfData[1][0] + listOfData[0][0]} setMessage={setMessage} />
            } 
            if (listOfData[0].ico) {
                return <Record ico={listOfData[0].ico} companyName={listOfData[0].company_name} address={listOfData[0].address} setMessage={setMessage} />
            }
            if (listOfData.length > 0) { // if user asking for company with company name (multiple records)
                let list = [];
                let newList = [];
                listOfData.map((item) => { // function that filters the unnecessary informations
                    if (item[0].length <= 2 || item[0].includes('ico=', 0) || item[0].includes('dic=', 0) )  {
                        return null;
                    } else {
                        return list.push(item);
                    }
                })  
                while(list.length > 0) { // spliting to arrays of 4 elements [ ico, some number, company name, address ]
                    newList.push(list.splice(0, 4));
                }
                return newList.map((item, i) => {
                    return <Record ico={item[0][0]} companyName={item[2][0]} address={item[3][0]} key={i} setMessage={setMessage} /> // rendering records
                });
            }
        }

    return (  
        <div className='app'>
            <form className='app__form' onSubmit={(e) => handleSubmit(e)}>
                <label>IČO:</label>
                <input onChange={(e) => setIco(e.target.value)} style={ icoErr ? {border: '1px solid red'} : null} />
                <p className='app__form-err'>{ icoErr ? 'Do kolonky IČO zadejte pouze číslo' : ''}</p>
                <label>Jméno firmy:</label>
                <input onChange={(e) => setCompanyName(e.target.value)} style={ companyNameErr ? {border: '1px solid red'} : null} />
                <p className='app__form-err'>{companyNameErr ? 'Při zadání IČO jsou ostatní vyhledávací kritéria nadbytečná' : ''}</p> 
                <input className='app__form-btn' type={'submit'} />
                <p>{message.length>0 ? message : ''}</p>
            </form>
            {data.length > 0 ?
            <table className='app__table'>
                <tbody>
                     <Record ico={'IČO'} companyName={'Název frimy'} address={'Adresa'} header={true} />
                    {renderItems(data)}
                </tbody>
            </table>
            : null}
        </div>
    )
}

export default App;