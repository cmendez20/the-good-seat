import { Form } from "react-router";

export default function ReviewForm() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Add new Review</h2>

      {/* 
      Theathre Name: AMC NorthPark 15
      Theatre Type: Dolby, IMAX, DIGITAL, Laser
      Auditorium #:
      Seat Row:
      Seat Num: 
      Notes:
      Would i seat there again?
      Image:
      */}
      <Form method="post" className="grid gap-4 max-w-72 mx-auto">
        <label htmlFor="theatre-name" className="-mb-2">
          Theatre Name:
        </label>
        <input
          id="theatre-name"
          type="text"
          name="theatre_name"
          className="bg-gray-50 rounded py-1 px-2 text-black"
          placeholder="Theatre Name"
        />

        <label className="-mb-2" htmlFor="screenType-select">
          Choose a screen type:
        </label>
        <select
          name="screenType"
          id="screenType-select"
          className="bg-gray-50 rounded py-1 px-2 text-black"
        >
          <option value="">--Please choose an option--</option>
          <option value="digital">Digital</option>
          <option value="dolby">Dolby</option>
          <option value="imax">IMAX</option>
          <option value="laser">Laser</option>
        </select>

        <label htmlFor="auditorium-number" className="-mb-2">
          Auditorium Number:
        </label>
        <input
          id="auditorium-number"
          type="number"
          name="auditoriumNumber"
          className="bg-gray-50 rounded py-1 px-2 text-black"
          placeholder="Auditorium Number"
        />
        <label htmlFor="row" className="-mb-2">
          Row:
        </label>
        <input
          id="row"
          type="text"
          name="row"
          className="bg-gray-50 rounded py-1 px-2 text-black"
          placeholder="Row"
        />

        <label htmlFor="seat-number" className="-mb-2">
          Seat Number:
        </label>
        <input
          id="seat-number"
          type="number"
          name="seatNumber"
          className="bg-gray-50 rounded py-1 px-2 text-black"
          placeholder="Seat Number"
        />

        <label htmlFor="notes" className="-mb-2">
          Notes:
        </label>
        <textarea
          id="notes"
          name="notes"
          className="bg-gray-50 rounded py-1 px-2 text-black"
          placeholder="Notes"
        ></textarea>

        <fieldset>
          <legend>Would I sit there again?</legend>

          <div className="flex gap-2">
            <input type="checkbox" id="yes" name="yes" />
            <label htmlFor="yes">Yes</label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="bg-slate-700 rounded p-4 py-2 max-w-min mx-auto hover:cursor-pointer hover:bg-slate-500 hover:transition-colors"
        >
          Submit
        </button>
      </Form>
    </>
  );
}
