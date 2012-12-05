package turtleroy

import mongodb.{MongoStorage, TurtleStorage}
import org.scalatra._
import net.liftweb.json._
import java.util.Date

class TurtleServlet extends ScalatraServlet {
  implicit val formats = DefaultFormats
  val idGenerator : IdGenerator = new RandomIdGenerator
  val storage : TurtleStorage = new MongoStorage

  post("/turtle") {
    val turtle = Turtle(idGenerator.nextId,
      Serialization.read[TurtleData](request.body))
    storage.storeTurtle(turtle)
    response.setHeader("Location", request.getRequestURL.toString + "/" + turtle.id)
    response.setStatus(201)
    render(turtle)
  }

  get("/turtle/:id") {
    handleTurtle(storage.findTurtle(params("id")))
  }

  get("/turtle/:author/:name") {
    handleTurtle(storage.findTurtle(params("author"), params("name")))
  }

  get("/turtles") {
    render(storage.turtles)
  }
  private def handleTurtle(maybeTurtle : Option[Turtle]) = maybeTurtle match {
    case Some(turtle) => render(turtle)
    case None => halt(404, "Turtle not found")
  }
  private def render(content: AnyRef) = {
    contentType = "application/json"
    net.liftweb.json.Serialization.write(content)
  }
}

case class Turtle(id: String, content: TurtleData, date: Date = new Date)
case class TurtleData(author: String, description: String, code: String)
