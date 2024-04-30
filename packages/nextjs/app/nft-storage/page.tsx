"use client";

import { AuthenticationEnsurer } from "./_components/Authenticator";
import { Identity } from "./_components/Identity";
import { MyUploader } from "./_components/MyUploader";
import { SpaceEnsurer } from "./_components/SpaceEnsurer";
import { Authenticator, Provider } from "@w3ui/react";
import type { NextPage } from "next";

const NftStoragePage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Provider>
        <Authenticator>
          <AuthenticationEnsurer>
            <Identity />
            <SpaceEnsurer>
              <MyUploader />
            </SpaceEnsurer>
          </AuthenticationEnsurer>
        </Authenticator>
      </Provider>
    </div>
  );
};

export default NftStoragePage;