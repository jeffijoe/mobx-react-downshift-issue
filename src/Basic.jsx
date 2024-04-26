import * as React from "react";
import { useCombobox } from "downshift";
import cx from "classnames";

const { useState } = React;

const books = [
  { id: "book-1", author: "Harper Lee", title: "To Kill a Mockingbird" },
  { id: "book-2", author: "Lev Tolstoy", title: "War and Peace" },
  { id: "book-3", author: "Fyodor Dostoyevsy", title: "The Idiot" },
  { id: "book-4", author: "Oscar Wilde", title: "A Picture of Dorian Gray" },
  { id: "book-5", author: "George Orwell", title: "1984" },
  { id: "book-6", author: "Jane Austen", title: "Pride and Prejudice" },
  { id: "book-7", author: "Marcus Aurelius", title: "Meditations" },
  {
    id: "book-8",
    author: "Fyodor Dostoevsky",
    title: "The Brothers Karamazov",
  },
  { id: "book-9", author: "Lev Tolstoy", title: "Anna Karenina" },
  { id: "book-10", author: "Fyodor Dostoevsky", title: "Crime and Punishment" },
];
function getBooksFilter(inputValue) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function booksFilter(book) {
    return (
      !inputValue ||
      book.title.toLowerCase().includes(lowerCasedInputValue) ||
      book.author.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

function ComboBox() {
  const [counter, setCounter] = useState(0);
  const [items, setItems] = React.useState(books);
  const [selectedItems, setSelectedItemsValue] = useState([]);
  const setSelectedItems = (items) => {
    setSelectedItemsValue(items);
    setCounter((c) => c + 1);
  };

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(books.filter(getBooksFilter(inputValue)));
    },
    items,
    // there's no actual selection happening in the hook, we're doing it custom via selectedItems.
    selectedItem: null,
    itemToString(item) {
      return item ? item.title : "";
    },
    onSelectedItemChange: ({ selectedItem }) => {
      console.log("onSelectedItemChange");
      if (!selectedItem) {
        return;
      }
      const index = selectedItems.indexOf(selectedItem);
      if (index > 0) {
        setSelectedItems([
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ]);
      } else if (index === 0) {
        setSelectedItems([...selectedItems.slice(1)]);
      } else {
        setSelectedItems([...selectedItems, selectedItem]);
      }
    },

    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep menu open after selection.
            highlightedIndex: state.highlightedIndex,
            inputValue: "", // don't add the item string as input value at selection.
          };
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: "", // don't add the item string as input value at selection.
          };
        default:
          return changes;
      }
    },
  });

  const inputPlaceholder = selectedItems.length
    ? `${selectedItems.length} books selected.`
    : "Best books ever.";

  return (
    <div>
      Counter:{" "}
      <span className="font-bold" data-testid="counter">
        {counter}
      </span>
      <div className="w-72 flex flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Choose your favorite books:
        </label>
        <div className="flex shadow-sm bg-white gap-0.5">
          <input
            placeholder={inputPlaceholder}
            className="w-full p-1.5"
            data-testid="search-input"
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      <ul
        className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && "bg-blue-300",
                selectedItems.includes(item) && "font-bold",
                "py-2 px-3 shadow-sm flex gap-3 items-center"
              )}
              key={item.id}
              data-testid={`book-${index}`}
              {...getItemProps({
                item,
                index,
                "aria-selected": selectedItems.includes(item),
              })}
              // If we overwrite the onMouseMove event,
              // then the change handler is only called once.
              // onMouseMove={() => {}}
            >
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={selectedItems.includes(item)}
                value={item}
                onChange={() => null}
              />
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-sm text-gray-700">{item.author}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default function Basic() {
  return (
    <div>
      Basic example
      <ComboBox />
    </div>
  );
}
