import { GeneratorOptions } from "./types";

type Props = {
  option: GeneratorOptions;
  options: any;
  setOptions: React.Dispatch<React.SetStateAction<any>>;
};
export const OptionDisplay = ({ option, options, setOptions }: Props) => {
  return (
    <>
      {option.type === "checkbox" && (
        <>
          <input
            type="checkbox"
            id={option.id}
            name={option.id}
            checked={options[option.id]}
            onChange={(e) =>
              setOptions((prev) => {
                return { ...prev, [option.id]: e.target.checked };
              })
            }
          />
          <label>{option.label}</label>{" "}
        </>
      )}
    </>
  );
};
