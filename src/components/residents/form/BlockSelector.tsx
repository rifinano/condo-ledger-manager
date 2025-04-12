
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface BlockSelectorProps {
  blockNumber: string;
  blocks: string[];
  onChange: (value: string) => void;
}

const BlockSelector = ({ blockNumber, blocks, onChange }: BlockSelectorProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="block" className="text-right">
        Block*
      </Label>
      <Select 
        value={blockNumber} 
        onValueChange={onChange}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select a block" />
        </SelectTrigger>
        <SelectContent>
          {blocks.map(block => (
            <SelectItem key={block} value={block}>{block}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BlockSelector;
