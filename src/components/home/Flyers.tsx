import React from 'react';

export default function Flyers() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 px-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Flyer%201.jpg"
              alt="Flyer page 1"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Flyer%202.jpg"
              alt="Flyer page 2"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}