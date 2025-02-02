import React from 'react';

import { LandManagementActions } from '../../organisms';

interface InputProps {
  actions: any;
}

export function ManagementActions({ actions }: InputProps): JSX.Element {
  return (
    <>
      <div className="topo-background-alternate">
        <LandManagementActions
          actions={actions.map((action: any) => ({
            name: action['schema:name'],
            description: action['schema:description'],
            imgSrc: action['schema:image']?.['@value'],
          }))}
          title="Land Management Actions"
          subtitle="This is how the project developers are planning to achieve the primary impact."
        />
      </div>
    </>
  );
}
