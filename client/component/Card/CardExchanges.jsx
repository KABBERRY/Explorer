
import React from 'react';

import Card from './Card';

const CardExchanges = () => (
  //@todo move this to config to avoid conflicts
  <Card title="Exchanges">
    <a href="https://crex24.com/exchange/KKC-BTC" target="_blank" rel="nofollow noopener">Crex24</a><br />
    <a href="https://graviex.net/markets/pscbtc/" target="_blank" rel="nofollow noopener">Graviex</a><br />
  </Card>
);

export default CardExchanges;
