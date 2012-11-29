package turtleroy

import mongodb.{MongoStorage, TurtleStorage}
import org.scalatra._
import net.liftweb.json._

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
    storage.findTurtle(params("id")) match {
      case Some(turtle) => render(turtle)
      case None => halt(404, "Turtle not found")
    }
  }
  private def render(content: AnyRef) = {
    contentType = "application/json"
    net.liftweb.json.Serialization.write(content)
  }
}

case class Turtle(id: String, content: TurtleData)
case class TurtleData(author: String, description: String, code: String)
