"use client";

import { useState } from "react";
import React from "react";
// import Select from "react-select";
import Select from "react-dropdown-select";
import "react-dropdown/style.css";
import { NftCard } from "~~/components/nft-card/NftCard";
import { AddressCard, AddressCardProps } from "~~/components/nft-card/values/AddressCard";
import { CollectionNameCard, CollectionNameCardProps } from "~~/components/nft-card/values/CollectionNameCard";
import { CollectionSymbolCard, CollectionSymbolCardProps } from "~~/components/nft-card/values/CollectionSymbolCard";
import { CollectionDetails } from "~~/components/nft-card/values/extensions/CollectionDetails";
import { useTokens } from "~~/hooks/useTokens2";

const AddressCardComponent = (props: AddressCardProps) => {
  return <AddressCard {...props} bgColor="bg-base-300" />;
};

const CollectionNameCardComponent = (props: CollectionNameCardProps) => {
  return <CollectionNameCard {...props} bgColor="bg-base-300" />;
};

const CollectionSymbolCardComponent = (props: CollectionSymbolCardProps) => {
  return <CollectionSymbolCard {...props} bgColor="bg-base-300" />;
};

const inputOptions: any[] = [
  "Image",
  "Id",
  "Name",
  "Description",
  "Attributes",
  "Address",
  "CollectionName",
  "CollectionSymbol",
];

export default function Collection({ params }: { params: { network: string; address: string } }) {
  const [checkeds, setCheckeds] = useState<boolean[]>([true, true, true, true, true, false, false, false]);

  const handleChange = (index: number) => {
    const temp: boolean[] = checkeds;

    temp[index] = !temp[index];

    setCheckeds([...temp]);
  };

  const inputComponents = inputOptions.map((inputName, index) => {
    return (
      <div key={index + "-input"}>
        <label className="m-1">
          {inputName}
          <input
            className="m-1"
            type="checkbox"
            checked={checkeds[index]}
            onChange={() => {
              handleChange(index);
            }}
          />
        </label>
      </div>
    );
  });

  const componentsToRender: any = [];
  for (let i = 0; i < checkeds.length; i++) {
    if (checkeds[i]) componentsToRender.push(inputOptions[i]);
  }

  const options = [
    { value: "ipfs", label: "IPFS" },
    { value: "nftstorage", label: "NFT Storage" },
    { value: "w3s", label: "web3.storage" },
  ];

  const defaultOption = options[1];

  const [selectedDropdownOption, setSelectedDropdownOption] = useState(defaultOption.value);

  const [backEndOption, setBackendOption] = useState(defaultOption.value);

  const [renderedTokenIds, setRenderedTokenIds] = useState<bigint[]>([
    BigInt(1),
    BigInt(2),
    BigInt(3),
    BigInt(4),
    BigInt(5),
    BigInt(6),
    BigInt(7),
    BigInt(8),
    BigInt(9),
    BigInt(10),
  ]);

  const { tokens, isLoading, isError } = useTokens(
    params["network"],
    params["address"],
    renderedTokenIds,
    backEndOption as "ipfs" | "nftstorage" | "w3s",
  );

  const tokensComponents = tokens.map((token, index) => {
    return <NftCard key={index} token={token} renderOrder={componentsToRender} />;
  });

  async function onSubmit(event: any) {
    event.preventDefault();

    setBackendOption(selectedDropdownOption);

    const tempArr = [];

    for (let i = event.target[1].value; i < Number(event.target[1].value) + Number(event.target[0].value); i++) {
      tempArr.push(BigInt(i));
    }

    setRenderedTokenIds([...tempArr]);
  }

  const [isShowingAdvancedSettings, setIsShowingAdvancedSettings] = useState(false);

  let advancedOutput;
  if (isShowingAdvancedSettings) {
    advancedOutput = (
      <>
        <div className="flex flex-wrap">{inputComponents}</div>
        <form
          onSubmit={(event: any) => {
            onSubmit(event);
          }}
        >
          <div className="bg-base-100 rounded p-1 flex flex-col items-center justify-center ">
            <p className="text-center m-0">Number To Render</p>

            <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
              <input
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                placeholder={"1"}
                defaultValue={10}
              />
              <br />
            </div>

            <p className="text-center m-0">Start Index</p>

            <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent`}>
              <input
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                placeholder={"1"}
                defaultValue={1}
              />
            </div>
            <p className="text-center m-0">Metadata Load Type</p>
            <div className="w-64">
              <Select
                options={options}
                className="text-black bg-base-100"
                onChange={(event: any) => {
                  setSelectedDropdownOption(event[0].value);
                }}
                values={[defaultOption]}
              />
            </div>

            <button type="submit" className="btn btn-sm btn-primary">
              Refresh
            </button>
          </div>
        </form>
      </>
    );
  } else {
    advancedOutput = <></>;
  }

  let mainContent;
  if (isLoading) {
    mainContent = <p>Loading...</p>;
  } else {
    if (isError) {
      mainContent = <p>There was an error. Please try changing the advanced settings.</p>;
    } else {
      mainContent = tokensComponents;
    }
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={() => {
          setIsShowingAdvancedSettings(!isShowingAdvancedSettings);
        }}
        className="btn btn-sm btn-primary"
      >
        Toggled Advanced Options
      </button>
      {advancedOutput}
      <div className="w-full">
        <CollectionDetails
          token={tokens[0]}
          showDescriptor={true}
          bgColor="bg-base-100"
          AddressCard={AddressCardComponent}
          CollectionNameCard={CollectionNameCardComponent}
          CollectionSymbolCard={CollectionSymbolCardComponent}
        />
      </div>
      <div className="flex flex-wrap justify-center m-1 p-1 bg-base-100 rounded lg:max-w-[1300px]">{mainContent}</div>{" "}
    </div>
  );
}