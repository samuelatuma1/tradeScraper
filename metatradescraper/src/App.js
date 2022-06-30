import './App.css';
import {useState} from 'react'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:8000")
function App() {
  const [tradeData, setTradeData] = useState([])
  socket.on("new data", (data) => {
    let tradeData = JSON.parse(data)
    setTradeData(tradeData)
  })
  /**
   * @desc Emits event to retrieves all trade data
   * @param {EventObject} e 
   */
  function retrieveAll(e){
    // Emit retrieve all event to socket
    socket.emit("retrieve all")
  }

  // Listen for all data
  socket.on("all data", (data) => {
    // If allData Comes, update tradeData
    let tradeData = JSON.parse(data)
    setTradeData(tradeData)
  })

  // Get latest 30
  /**
   * @desc Emits event to Retrieve the 30 most recent tradeData
   * @param {EventObject} e 
   */
  function retrieveRecent30(e){
    socket.emit("retrieve most recent")
  }
 return (<>
      <div className='tradeDiv'>
        <table>
          <caption>Trade Details</caption>
          <thead>
            <tr>
              <th>Market Time</th>
              <th>Balance</th>
              <th>Equity</th>
            </tr>
          </thead>

          <tbody>
              {
                tradeData.map( (trade, idx) => (
                  <tr key={idx}>
                    <td>{trade.marketTime}</td>
                    <td>{trade.balance}</td>
                    <td>{trade.equity}</td>
                  </tr>
                ))
              }
              <tr>
                <td colSpan='3' className='specifyDetails'>
                    <button onClick={retrieveAll}>
                    Trade History
                    </button>

                    <button onClick={retrieveRecent30}>
                    Get Latest 30
                    </button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
 </>)
}

export default App;
