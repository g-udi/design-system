import { useId, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gaudi/design-system/core/Tabs';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadClear,
  SignaturePadUndo,
  SignaturePadRedo,
} from '@gaudi/design-system/core/SignaturePad';

export function DrawOrTypeExample() {
  const [mode, setMode] = useState('draw');
  const [strokes, setStrokes] = useState([]);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(null);
  const id = useId();
  return (
    <div className="grid w-full max-w-lg gap-3">
      <p className="text-sm font-medium">Add your signature</p>
      <Tabs
        value={mode}
        onValueChange={(value) => {
          setMode(value);
          setSaved(null);
        }}
      >
        <TabsList aria-label="Signature entry method">
          <TabsTrigger value="draw">Draw</TabsTrigger>
          <TabsTrigger value="type">Type your name</TabsTrigger>
        </TabsList>
        <TabsContent value="draw">
          <SignaturePad
            value={strokes}
            onValueChange={(value) => {
              setStrokes(value);
              setSaved(null);
            }}
          >
            <SignaturePadArea aria-label="Draw your signature">
              <SignaturePadGuide />
              <SignaturePadPlaceholder />
            </SignaturePadArea>
            <div className="flex flex-wrap gap-2">
              <SignaturePadUndo />
              <SignaturePadRedo />
              <SignaturePadClear size="sm">Clear</SignaturePadClear>
            </div>
          </SignaturePad>
        </TabsContent>
        <TabsContent value="type" className="grid gap-3">
          <Label htmlFor={id}>Full name</Label>
          <Input
            id={id}
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(null);
            }}
            placeholder="Your full name"
          />
          {name.trim() && (
            <p
              aria-label="Typed signature preview"
              className="break-words py-3 font-serif text-2xl italic"
            >
              {name.trim()}
            </p>
          )}
        </TabsContent>
      </Tabs>
      <Button
        className="justify-self-start"
        disabled={mode === 'draw' ? strokes.length === 0 : !name.trim()}
        onClick={() =>
          setSaved(
            mode === 'draw' ? { mode, strokes } : { mode, name: name.trim() },
          )
        }
      >
        Use signature
      </Button>
      <p role="status" className="min-h-5 text-sm">
        {saved
          ? saved.mode === 'type'
            ? `Typed signature saved for ${saved.name}.`
            : 'Drawn signature saved.'
          : ''}
      </p>
    </div>
  );
}
