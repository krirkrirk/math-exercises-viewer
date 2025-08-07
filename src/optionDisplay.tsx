import { useEffect, useState } from "react";
import { GeneratorOption } from "./types";

type Props = {
  option: GeneratorOption;
  options: any;
  setOptions: React.Dispatch<React.SetStateAction<any>>;
};
export const OptionDisplay = ({ option, options, setOptions }: Props) => {
  const [multiselectValuesSelected, setMultiselectValuesSelected] = useState<
    string[]
  >(options?.[option.id] ?? option.defaultValue ?? []);
  console.log(option, options, multiselectValuesSelected);
  // useEffect(() => {
  //   if(!options) return;
  //   setMultiselectValuesSelected(options?.[option.id] ?? []);
  // }, [JSON.stringify(options)]);

  const handleMultiselectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMultiselectValuesSelected((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((value) => value !== e.target.value);
      }
      return [...prev, e.target.value];
    });
  };

  useEffect(() => {
    if (!multiselectValuesSelected.length) {
      setOptions((prev) => {
        return { ...prev, [option.id]: undefined };
      });
      return;
    }
    setOptions((prev) => {
      return { ...prev, [option.id]: multiselectValuesSelected };
    });
  }, [multiselectValuesSelected]);

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
      {option.type === "select" && (
        <>
          <select
            id={option.id}
            name={option.id}
            value={options[option.id] ?? option.defaultValue}
            onChange={(e) =>
              setOptions((prev) => {
                return { ...prev, [option.id]: e.target.value };
              })
            }
          >
            {option.values!.map((el: any) => (
              <option value={el}>{el}</option>
            ))}
          </select>{" "}
        </>
      )}
      {option.type === "multiselect" && (
        <>
          <select
            id={option.id}
            name={option.id}
            multiple
            value={options[option.id] ?? option.defaultValue}
            onChange={(e) => {
              // console.log("pefjzpe", e.target.value);
              handleMultiselectChange(e);
            }}
          >
            {option.values!.map((el: string) => (
              <option value={el}>
                {multiselectValuesSelected.includes(el) ? "☑" : ""}
                {el}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};
