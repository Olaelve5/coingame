import { v4 as uuidv4 } from 'uuid';

function getPlayerId() {
    let playerId = sessionStorage.getItem('playerId');
    
    if (!playerId) {
        playerId = uuidv4();
        sessionStorage.setItem('playerId', playerId);
    }
    
    return playerId;
}

export default getPlayerId;