import { Tag, TagMap } from "@/types/post";
import React from "react";

interface IProps {
  initialTagMap: TagMap;
  handleFilterChange: (tag: Tag, enabled: true | false) => void;
}

export default function Filters({ initialTagMap, handleFilterChange }: IProps) {
  const [tagMap, setTagMap] = React.useState<TagMap>({});

  React.useEffect(() => {
    setTagMap(initialTagMap);
  }, [initialTagMap]);

  return (
    <div>
      {Object.keys(tagMap).map((tag) => (
        <div key={tag}>
          <input
            id={tag}
            type="checkbox"
            name={tag}
            checked={tagMap[tag]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const tagMapClone = { ...tagMap };
              tagMapClone[tag] = e.target.checked;
              setTagMap(tagMapClone);
              handleFilterChange(tag, e.target.checked);
            }}
          />
          <label htmlFor={tag}>{tag}</label>
        </div>
      ))}
    </div>
  );
}
