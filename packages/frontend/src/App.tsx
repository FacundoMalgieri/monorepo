import "styles/base.scss";
import React, { FC } from "react";

import WalletList from "components/WalletList";

const App: FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <WalletList />
    </div>
  );
};

export default App;
