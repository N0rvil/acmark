import React from 'react';
import axios from 'axios';
import './Record.css';

const Record = ({ ico, companyName, address, header, setMessage }) => {

    const saveIntoDatabase = () => {
        const data = { ico , companyName, address }
        axios({
            method: 'POST',
            url: `http://localhost/acmark-task_backend/savetodatabase.php`,
            data: data,
        })
        .then(res => {
            if (res.data === 'Success') { // if record is write to database successfuly 
                setMessage('Úspěšně uloženo do databáze');   
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            } else { // if record is write to database unsuccessfuly
                setMessage('Omlouváme se ale něco se pokazilo');  
            }
        })
        .catch(err => console.log(err)); 
    }

    return (
        <tr>
            <td className={header ? 'record__column-header' : 'record__column'}>{ico}</td>
            <td className={header ? 'record__column-header' : 'record__column'}>{companyName}</td>
            <td className={header ? 'record__column-header' : 'record__column'}>{address}</td>
            {header ? null :
                <td className='record__column'>
                    <button onClick={() => saveIntoDatabase()}>
                        Zapsat do databáze
                    </button>
                </td>
            }
        </tr>
    )
}

export default Record;