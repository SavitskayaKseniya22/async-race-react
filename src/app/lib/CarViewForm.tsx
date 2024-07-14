import { CarType } from "@/type";
import { getRandomColor, getRandomName } from "@/utils";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { useRef } from "react";
import { mutate } from "swr";

export default function CarViewForm({
  isDisabled = false,
  type,
  defaultValues,
}: {
  type: "Update" | "Create";
  defaultValues?: CarType;
  isDisabled?: boolean;
}) {
  const colorInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  return (
    <form
      className="flex gap-2"
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const carName = formData.get("carName");
        const carColor = formData.get("carColor");

        try {
          if (type === "Update" && defaultValues) {
            await fetch("/api/car", {
              method: "PUT",
              body: JSON.stringify({ id: defaultValues.id, carName, carColor, updateType: "view" }),
            });
          }
          if (type === "Create") {
            await fetch("/api/car", {
              method: "POST",
              body: JSON.stringify({ carName, carColor }),
            });
          }

          if (type === "Create") {
            form.reset();
          }

          mutate(`/api/cars?page=1`);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <input
        type="text"
        className="input grow"
        placeholder="Enter car name"
        name="carName"
        required
        ref={nameInput}
        defaultValue={(type === "Update" && defaultValues && defaultValues.name) || ""}
        onFocus={async (e) => {
          if (e.target.value === "") {
            try {
              const response = await fetch("./api/carNames");
              const carNames = await response.json();
              const randomName = getRandomName(carNames);
              e.target.value = randomName;
            } catch (error) {
              console.log(error);
            }
          }
        }}
      />
      <input
        type="color"
        name="carColor"
        ref={colorInput}
        defaultValue={(type === "Update" && defaultValues && defaultValues.color) || ""}
        onFocus={(e) => {
          if (e.target.value === "#000000") {
            const randomColor = getRandomColor();
            e.target.value = randomColor;
          }
        }}
      />
      <button
        className="btn"
        type="button"
        disabled={isDisabled}
        onClick={async () => {
          const carName = nameInput.current;
          const carColor = colorInput.current;

          if (carName) {
            try {
              const response = await fetch("./api/carNames");
              const carNames = await response.json();
              const randomName = getRandomName(carNames);
              carName.value = randomName;
            } catch (error) {
              console.log(error);
            }
          }
          if (carColor) {
            const randomColor = getRandomColor();
            carColor.value = randomColor;
          }
        }}
      >
        <ArrowPathIcon className="size-6 text-white" />
      </button>
      <button className="btn" type="submit" disabled={isDisabled}>
        {type}
      </button>
    </form>
  );
}
